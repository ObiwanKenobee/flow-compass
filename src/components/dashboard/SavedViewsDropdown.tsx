import { useState } from 'react';
import { Bookmark, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSavedViews } from '@/hooks/use-saved-views';
import { toast } from 'sonner';

interface SavedViewsDropdownProps {
  userId: string;
  currentConfig: any;
  onLoadView: (config: any) => void;
}

export const SavedViewsDropdown = ({ userId, currentConfig, onLoadView }: SavedViewsDropdownProps) => {
  const { views, saveView, deleteView } = useSavedViews(userId);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');

  const handleSave = async () => {
    if (!newName.trim()) {
      toast.error('Enter a name for the view');
      return;
    }
    await saveView(newName.trim(), currentConfig);
    setNewName('');
    setSaving(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-1">
          <Bookmark className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground">Saved Views</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {views.length === 0 && !saving && (
          <div className="px-2 py-3 text-xs text-muted-foreground text-center">No saved views yet</div>
        )}

        {views.map((v) => (
          <DropdownMenuItem key={v.id} className="flex justify-between items-center group" onSelect={() => onLoadView(v.view_config)}>
            <span className="text-sm truncate">{v.name}</span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteView(v.id); }}
              className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {saving ? (
          <div className="p-2 flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="View name…"
              className="h-8 text-xs"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button size="sm" className="h-8 px-2 text-xs" onClick={handleSave}>Save</Button>
          </div>
        ) : (
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setSaving(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            <span className="text-sm">Save current view</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
