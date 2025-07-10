"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { usePreferences } from "@/contexts/preferences-context"
import { toast } from "@/hooks/use-toast"
import { Settings, Bell, MessageSquare, Volume2, Eye, SkipForward, CheckCircle, Save } from "lucide-react"

export default function PreferencesPage() {
  const { preferences, updatePreferences, loading } = usePreferences()
  const [saving, setSaving] = useState(false)
  const [localPreferences, setLocalPreferences] = useState(preferences)

  const handleSave = async () => {
    if (!localPreferences) return

    try {
      setSaving(true)
      await updatePreferences(localPreferences)
      toast({
        title: "Success",
        description: "Preferences saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateLocalPreference = (path: string, value: boolean) => {
    if (!localPreferences) return

    const keys = path.split(".")
    const updated = { ...localPreferences }
    let current: any = updated

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setLocalPreferences(updated)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!localPreferences) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Failed to load preferences</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            User Preferences
          </h1>
          <p className="text-gray-600 mt-2">Customize your chat experience and notification settings</p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Browser Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive desktop notifications for new messages when the app is in the background
                  </p>
                </div>
                <Switch
                  checked={localPreferences.notifications.browser}
                  onCheckedChange={(checked) => updateLocalPreference("notifications.browser", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center">
                  <Volume2 className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <Label className="text-base">Message Sounds</Label>
                    <p className="text-sm text-gray-500">Play sound notifications for incoming messages</p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.notifications.sound}
                  onCheckedChange={(checked) => updateLocalPreference("notifications.sound", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Chat Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <Label className="text-base">Auto-prioritize Unread Conversations</Label>
                    <p className="text-sm text-gray-500">
                      Automatically move unread conversations to the top of the list
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.chat.autoPrioritizeUnread}
                  onCheckedChange={(checked) => updateLocalPreference("chat.autoPrioritizeUnread", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center">
                  <SkipForward className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <Label className="text-base">Skip to Next Unread</Label>
                    <p className="text-sm text-gray-500">
                      Automatically jump to the next unread conversation after reading one
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.chat.skipToNextUnread}
                  onCheckedChange={(checked) => updateLocalPreference("chat.skipToNextUnread", checked)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                  <div>
                    <Label className="text-base">Show Conversation Status</Label>
                    <p className="text-sm text-gray-500">
                      Display conversation status indicators (in-progress, resolved)
                    </p>
                  </div>
                </div>
                <Switch
                  checked={localPreferences.chat.showConversationStatus}
                  onCheckedChange={(checked) => updateLocalPreference("chat.showConversationStatus", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
