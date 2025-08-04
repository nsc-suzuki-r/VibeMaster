import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { LearningNote, Level } from "@shared/schema";

export default function LearningNotes() {
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notes = [] } = useQuery<LearningNote[]>({
    queryKey: ["/api/learning-notes"]
  });

  const { data: levels = [] } = useQuery<Level[]>({
    queryKey: ["/api/levels"]
  });

  const createNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("POST", "/api/learning-notes", {
        content,
        title: null,
        levelId: null,
        taskId: null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning-notes"] });
      setNewNoteContent("");
      setIsDialogOpen(false);
    }
  });

  const handleCreateNote = () => {
    if (!newNoteContent.trim()) return;
    createNoteMutation.mutate(newNoteContent);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date(date));
  };

  const getLevelInfo = (levelId: string | null) => {
    if (!levelId) return null;
    const level = levels.find(l => l.id === levelId);
    return level ? { number: level.levelNumber, color: level.color } : null;
  };

  const getLevelBadgeColor = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-primary text-white';
      case 'secondary': return 'bg-secondary text-white';
      case 'success': return 'bg-success text-white';
      case 'warning': return 'bg-warning text-white';
      case 'danger': return 'bg-danger text-white';
      case 'purple': return 'bg-purple text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const recentNotes = notes.slice(0, 3); // Show only the 3 most recent notes

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学習メモ</h3>
        
        <div className="space-y-3">
          {recentNotes.map((note) => {
            const levelInfo = getLevelInfo(note.levelId);
            return (
              <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {formatDate(note.createdAt)}
                  </span>
                  {levelInfo && (
                    <Badge className={`text-xs ${getLevelBadgeColor(levelInfo.color)}`}>
                      レベル{levelInfo.number}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {note.content}
                </p>
              </div>
            );
          })}
          
          {notes.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              学習メモはまだありません
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600"
            >
              <Edit className="mr-2 h-4 w-4" />
              新しいメモを追加
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>新しい学習メモを追加</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">メモ内容</label>
                <Textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="学習で気づいたことや感想を記録してください"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button 
                  onClick={handleCreateNote}
                  disabled={!newNoteContent.trim()}
                >
                  追加
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
