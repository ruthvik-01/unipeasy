"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserAnalytics } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  BookOpen,
  FileText,
  Calendar,
  Mail,
  TrendingUp,
  Target,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { branches, getSkillTrack } from "@/lib/skills-data";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserAnalytics | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "userAnalytics"));
      const usersList: UserAnalytics[] = [];
      querySnapshot.forEach((doc) => {
        usersList.push(doc.data() as UserAnalytics);
      });
      // Sort by last active date (most recent first)
      usersList.sort((a, b) => 
        new Date(b.lastActiveDate).getTime() - new Date(a.lastActiveDate).getTime()
      );
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate unique topics count from history
  const getUniqueTopicsCount = (user: UserAnalytics) => {
    if (!user.topicsHistory || user.topicsHistory.length === 0) return 0;
    const uniqueTopics = new Set(user.topicsHistory.map(t => t.topic.toLowerCase().trim()));
    return uniqueTopics.size;
  };

  // Calculate total unique topics across all users
  const totalUniqueTopics = users.reduce((sum, u) => sum + getUniqueTopicsCount(u), 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString();
  };

  const isActiveToday = (lastActive: string) => {
    const today = new Date().toISOString().split("T")[0];
    return lastActive === today;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">
            View all registered users and their learning analytics
          </p>
        </div>
        <Button variant="outline" onClick={fetchUsers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-950/30 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-950/30 rounded-lg">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.filter((u) => isActiveToday(u.lastActiveDate)).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-950/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalUniqueTopics}
                </p>
                <p className="text-sm text-muted-foreground">Total Topics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-950/30 rounded-lg">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, u) => sum + (u.totalMaterialsAccessed || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Materials Accessed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-100 dark:bg-pink-950/30 rounded-lg">
                <Target className="h-6 w-6 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {users.reduce((sum, u) => sum + (u.totalSkillLevelsCompleted || 0), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Skills Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Users ({filteredUsers.length})
            </CardTitle>
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold">
                {searchQuery ? "No users found" : "No users yet"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? "Try a different search term"
                  : "Users will appear here once they sign up"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold text-center">Topics</TableHead>
                    <TableHead className="font-semibold text-center">Materials</TableHead>
                    <TableHead className="font-semibold text-center">Skills</TableHead>
                    <TableHead className="font-semibold">Last Active</TableHead>
                    <TableHead className="font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.userId} className="hover:bg-muted/30">
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.displayName || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{getUniqueTopicsCount(user)}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{user.totalMaterialsAccessed || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          <Target className="h-3 w-3 mr-1" />
                          {user.totalSkillLevelsCompleted || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isActiveToday(user.lastActiveDate) && (
                            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                          )}
                          <span className={isActiveToday(user.lastActiveDate) ? "text-emerald-600 font-medium" : ""}>
                            {formatDate(user.lastActiveDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Details
            </DialogTitle>
            <DialogDescription>
              Detailed analytics for {selectedUser?.displayName || selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* User Info */}
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-semibold text-primary">
                        {(selectedUser.displayName || selectedUser.email || "U")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{selectedUser.displayName || "Unknown User"}</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedUser.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Joined: {formatDate(selectedUser.joinedDate)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{getUniqueTopicsCount(selectedUser)}</p>
                    <p className="text-xs text-muted-foreground">Topics Learned</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30">
                    <FileText className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedUser.totalMaterialsAccessed || 0}</p>
                    <p className="text-xs text-muted-foreground">Materials</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <Target className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{selectedUser.totalSkillLevelsCompleted || 0}</p>
                    <p className="text-xs text-muted-foreground">Skills Levels</p>
                  </div>
                </div>

                {/* Skills Progress */}
                {selectedUser.skillsProgress && Object.keys(selectedUser.skillsProgress).length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-600" />
                      Skills Progress
                    </h4>
                    <div className="space-y-3">
                      {Object.values(selectedUser.skillsProgress).map((skill) => {
                        const skillData = getSkillTrack(skill.skillSlug);
                        const progress = Math.round((skill.completedLevels.length / skill.totalLevels) * 100);
                        const branchInfo = branches.find(b => b.id === skill.branch);
                        return (
                          <div key={skill.skillSlug} className="p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{skill.skillTitle}</span>
                                {skill.branch && (
                                  <Badge variant="outline" className="text-xs">
                                    {branchInfo?.name || skill.branch}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {skill.completedLevels.length}/{skill.totalLevels}
                                </span>
                                {progress === 100 && (
                                  <Trophy className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              Last active: {new Date(skill.lastActiveDate).toLocaleDateString()}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Topics */}
                {selectedUser.topicsHistory && selectedUser.topicsHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Topics Searched</h4>
                    <div className="space-y-2">
                      {/* Show unique topics only */}
                      {[...new Map(selectedUser.topicsHistory.map(e => [e.topic.toLowerCase(), e])).values()]
                        .slice(0, 10)
                        .map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                          <span className="truncate flex-1">{entry.topic}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(entry.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Materials */}
                {selectedUser.materialsHistory && selectedUser.materialsHistory.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Recent Materials Accessed</h4>
                    <div className="space-y-2">
                      {selectedUser.materialsHistory.slice(0, 10).map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 text-sm">
                          <div>
                            <p className="font-medium">{entry.subjectTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              Unit {entry.unitNumber}: {entry.unitTitle}
                            </p>
                          </div>
                          <Badge variant="outline">{entry.branch}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
