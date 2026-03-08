import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

type TableName = 'regions' | 'climate_funds' | 'impact_projects' | 'market_instruments' | 'microfinance_loans' | 'funding_gaps';

const TABLE_CONFIGS: Record<TableName, { label: string; editableFields: string[] }> = {
  regions: {
    label: 'Regions',
    editableFields: ['name', 'lat', 'lng', 'capital_in', 'capital_out', 'status', 'funding_gap'],
  },
  climate_funds: {
    label: 'Climate Funds',
    editableFields: ['name', 'pledged', 'approved', 'contracted', 'released', 'deployed', 'verified', 'co_financing_ratio'],
  },
  impact_projects: {
    label: 'Impact Projects',
    editableFields: ['name', 'region', 'sector', 'financial_return', 'impact_return', 'capital_deployed', 'risk_tier', 'verified'],
  },
  market_instruments: {
    label: 'Market Instruments',
    editableFields: ['name', 'type', 'spot_price', 'price_unit', 'change_30d', 'issued_volume', 'retired_volume', 'verification_tier'],
  },
  microfinance_loans: {
    label: 'Microfinance Loans',
    editableFields: ['region', 'lat', 'lng', 'total_loans', 'active_loans', 'avg_loan_size', 'repayment_rate', 'women_borrowers'],
  },
  funding_gaps: {
    label: 'Funding Gaps',
    editableFields: ['region', 'adaptation', 'biodiversity', 'food_systems', 'clean_energy', 'health_resilience', 'urgency'],
  },
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTable, setActiveTable] = useState<TableName>('regions');
  const [rows, setRows] = useState<any[]>([]);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editValues, setEditValues] = useState<Record<string, any>>({});
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newValues, setNewValues] = useState<Record<string, any>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchRows();
  }, [isAdmin, activeTable]);

  const checkAdminAccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate('/auth'); return; }
    
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .eq('role', 'admin')
      .maybeSingle();
    
    if (!data) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    setIsAdmin(true);
    setLoading(false);
  };

  const fetchRows = async () => {
    const { data, error } = await supabase.from(activeTable).select('*');
    if (error) { toast.error(error.message); return; }
    setRows(data || []);
  };

  const handleEdit = (row: any) => {
    setEditingRow(row.id);
    const vals: Record<string, any> = {};
    TABLE_CONFIGS[activeTable].editableFields.forEach(f => { vals[f] = row[f]; });
    setEditValues(vals);
  };

  const handleSave = async () => {
    if (!editingRow) return;
    const { error } = await supabase.from(activeTable).update(editValues).eq('id', editingRow);
    if (error) { toast.error(error.message); return; }
    toast.success('Record updated');
    setEditingRow(null);
    fetchRows();
  };

  const handleAdd = async () => {
    const { error } = await supabase.from(activeTable).insert(newValues as any);
    if (error) { toast.error(error.message); return; }
    toast.success('Record added');
    setShowAddDialog(false);
    setNewValues({});
    fetchRows();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from(activeTable).delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Record deleted');
    setDeleteConfirm(null);
    fetchRows();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Verifying admin access...</div>
      </div>
    );
  }

  const config = TABLE_CONFIGS[activeTable];
  const displayFields = ['id', ...config.editableFields];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Data Management</p>
            </div>
          </div>
          <Button size="sm" onClick={() => { setNewValues({}); setShowAddDialog(true); }}>
            <Plus className="w-4 h-4 mr-1" /> Add Record
          </Button>
        </div>
      </header>

      <main className="px-4 md:px-6 py-4 max-w-[1600px] mx-auto space-y-4">
        {/* Table selector */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TABLE_CONFIGS) as TableName[]).map(t => (
            <button
              key={t}
              onClick={() => { setActiveTable(t); setEditingRow(null); }}
              className={`px-3 py-1.5 text-xs rounded-md transition-colors border ${
                activeTable === t
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-border hover:bg-accent'
              }`}
            >
              {TABLE_CONFIGS[t].label}
            </button>
          ))}
        </div>

        {/* Data table */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-foreground">{config.label} ({rows.length} records)</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {displayFields.map(f => (
                      <TableHead key={f} className="text-xs font-mono whitespace-nowrap">{f}</TableHead>
                    ))}
                    <TableHead className="text-xs">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map(row => (
                    <TableRow key={row.id}>
                      {displayFields.map(f => (
                        <TableCell key={f} className="text-xs font-mono">
                          {editingRow === row.id && f !== 'id' ? (
                            <Input
                              value={editValues[f] ?? ''}
                              onChange={e => setEditValues(prev => ({ ...prev, [f]: e.target.value }))}
                              className="h-7 text-xs bg-secondary border-border min-w-[80px]"
                            />
                          ) : (
                            <span className="truncate max-w-[150px] block">
                              {typeof row[f] === 'object' ? JSON.stringify(row[f]) : String(row[f] ?? '')}
                            </span>
                          )}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1">
                          {editingRow === row.id ? (
                            <>
                              <Button variant="ghost" size="sm" onClick={handleSave} className="h-7 w-7 p-0 text-primary">
                                <Save className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setEditingRow(null)} className="h-7 w-7 p-0">
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} className="h-7 w-7 p-0">
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteConfirm(row.id)}
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Record Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add {config.label} Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {config.editableFields.map(f => (
              <div key={f} className="space-y-1">
                <label className="text-xs font-mono text-muted-foreground">{f}</label>
                <Input
                  value={newValues[f] ?? ''}
                  onChange={e => setNewValues(prev => ({ ...prev, [f]: e.target.value }))}
                  className="bg-secondary border-border text-sm"
                  placeholder={f}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && handleDelete(deleteConfirm)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
