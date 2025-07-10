"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Database, Upload, FileText, Search, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function KnowledgeBasePage() {
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      console.log("Processing file:", file.name)
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded to the knowledge base`,
      })
    })
  }

  const mockKnowledgeItems = [
    {
      id: "1",
      title: "Banking Services Overview",
      type: "document",
      category: "General",
      lastUpdated: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      title: "Loan Application Process",
      type: "guide",
      category: "Loans",
      lastUpdated: "2024-01-10",
      status: "active",
    },
    {
      id: "3",
      title: "Customer Support FAQ",
      type: "faq",
      category: "Support",
      lastUpdated: "2024-01-08",
      status: "draft",
    },
  ]

  const filteredItems = mockKnowledgeItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Database className="h-8 w-8 mr-3 text-blue-600" />
            Knowledge Base Management
          </h1>
          <p className="text-gray-600 mt-2">Upload and manage knowledge base content for the chatbot system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Knowledge Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files here, or click to select files
                    <br />
                    <span className="text-sm">Supports: PDF, DOC, DOCX, TXT, CSV</span>
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Add Knowledge Article
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Enter article title" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" placeholder="Enter category" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" placeholder="Enter article content..." className="min-h-[120px]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input id="tags" placeholder="Enter tags separated by commas" />
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Article
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Knowledge Items List */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Knowledge Items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search knowledge items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  {filteredItems.map((item) => (
                    <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                          <p className="text-xs text-gray-400 mt-1">Updated: {item.lastUpdated}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-xs">
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Articles</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-medium text-green-600">142</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Draft</span>
                  <span className="font-medium text-yellow-600">14</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Categories</span>
                  <span className="font-medium">8</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
