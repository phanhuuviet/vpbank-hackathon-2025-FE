"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { usePreferences } from "@/contexts/preferences-context"
import { toast } from "@/hooks/use-toast"
import type { QuickReply } from "@/types/settings"
import { MessageSquare, Plus, Edit, Trash2, Zap, Info } from "lucide-react"

export default function QuickRepliesPage() {
  const { quickReplies, createQuickReply, updateQuickReply, deleteQuickReply, loading } = usePreferences()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReply, setEditingReply] = useState<QuickReply | null>(null)
  const [formData, setFormData] = useState({
    shortcut: "",
    message: "",
  })
  const [saving, setSaving] = useState(false)

  const handleCreate = () => {
    setEditingReply(null)
    setFormData({ shortcut: "", message: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (reply: QuickReply) => {
    setEditingReply(reply)
    setFormData({
      shortcut: reply.shortcut,
      message: reply.message,
    })
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.shortcut.trim() || !formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both shortcut and message fields",
        variant: "destructive",
      })
      return
    }

    if (!formData.shortcut.startsWith("/")) {
      toast({
        title: "Validation Error",
        description: "Shortcut must start with '/'",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)
      if (editingReply) {
        await updateQuickReply(editingReply.id, formData)
        toast({
          title: "Success",
          description: "Quick reply updated successfully",
        })
      } else {
        await createQuickReply({ ...formData, userId: "yourUserIdHere" }) // replace with actual user ID
        toast({
          title: "Success",
          description: "Quick reply created successfully",
        })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quick reply",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quick reply?")) return

    try {
      await deleteQuickReply(id)
      toast({
        title: "Success",
        description: "Quick reply deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete quick reply",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="h-8 w-8 mr-3 text-blue-600" />
              Quick Reply Templates
            </h1>
            <p className="text-gray-600 mt-2">
              Create and manage shortcut-based message templates for faster responses
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Add Quick Reply
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Replies List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Quick Replies ({quickReplies.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {quickReplies.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quick replies yet</h3>
                    <p className="text-gray-500 mb-4">Create your first quick reply template to get started</p>
                    <Button onClick={handleCreate}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Quick Reply
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quickReplies.map((reply) => (
                      <div key={reply.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge variant="secondary" className="font-mono">
                                {reply.shortcut}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{reply.message}</p>
                            <p className="text-xs text-gray-500">
                              Updated {new Date(reply.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(reply)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(reply.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Help & Variables */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  How to Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Creating Shortcuts</h4>
                  <p className="text-sm text-gray-600">
                    Shortcuts must start with "/" (e.g., /hello, /thanks). Type the shortcut in chat and press space or
                    enter to expand.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Available Variables</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        #FIRST_NAME
                      </Badge>
                      <span className="text-xs text-gray-500">Customer's first name</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-xs">
                        #PAGE_NAME
                      </Badge>
                      <span className="text-xs text-gray-500">Facebook page name</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Example Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <Badge variant="secondary" className="font-mono mb-1">
                    /hello
                  </Badge>
                  <p className="text-gray-600">Hi #FIRST_NAME, welcome to #PAGE_NAME!</p>
                </div>
                <div className="text-sm">
                  <Badge variant="secondary" className="font-mono mb-1">
                    /hours
                  </Badge>
                  <p className="text-gray-600">Our business hours are Monday to Friday, 9 AM to 6 PM.</p>
                </div>
                <div className="text-sm">
                  <Badge variant="secondary" className="font-mono mb-1">
                    /thanks
                  </Badge>
                  <p className="text-gray-600">Thank you for contacting us, #FIRST_NAME!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Reply Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingReply ? "Edit Quick Reply" : "Create Quick Reply"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="shortcut">Shortcut</Label>
                <Input
                  id="shortcut"
                  placeholder="/hello"
                  value={formData.shortcut}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortcut: e.target.value }))}
                />
                <p className="text-xs text-gray-500">Must start with "/" and contain no spaces</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message Template</Label>
                <Textarea
                  id="message"
                  placeholder="Hi #FIRST_NAME, welcome to #PAGE_NAME! How can I help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">Use #FIRST_NAME and #PAGE_NAME for dynamic content</p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : editingReply ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
