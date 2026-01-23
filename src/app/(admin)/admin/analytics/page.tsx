"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Activity,
  BarChart3,
  Loader2,
  RefreshCw,
  Search,
  Eye,
  Target,
} from "lucide-react";
import { getPlatformAnalytics, PlatformAnalytics, getSkillsAnalytics } from "@/lib/analytics";
import { skillTracks, branches, type Branch } from "@/lib/skills-data";

interface SkillAnalytics {
  slug: string;
  title: string;
  branch: string;
  totalCompletions: number;
  usersStarted: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [skillsAnalytics, setSkillsAnalytics] = useState<SkillAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    const data = await getPlatformAnalytics();
    const skills = await getSkillsAnalytics();
    setAnalytics(data);
    setSkillsAnalytics(skills);
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading analytics...</span>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    );
  }

  const totalSkillsCompleted = skillsAnalytics.reduce((sum, s) => sum + s.totalCompletions, 0);

  const statCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-950/30",
      description: "Registered users",
    },
    {
      title: "Topics Searched",
      value: analytics.totalTopicsSearched,
      icon: Search,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-950/30",
      description: "Total AI queries",
    },
    {
      title: "Materials Accessed",
      value: analytics.totalMaterialsAccessed,
      icon: FileText,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-950/30",
      description: "PDF views",
    },
    {
      title: "Skills Completed",
      value: totalSkillsCompleted,
      icon: Target,
      color: "text-pink-600",
      bg: "bg-pink-100 dark:bg-pink-950/30",
      description: "Skill levels done",
    },
    {
      title: "Active Today",
      value: analytics.activeUsersToday,
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-950/30",
      description: "Users today",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Platform Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of user engagement and content performance
          </p>
        </div>
        <Button variant="outline" onClick={fetchAnalytics} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Engagement
          </CardTitle>
          <CardDescription>
            User activity over the past 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20">
              <p className="text-4xl font-bold text-blue-600">{analytics.activeUsersWeek}</p>
              <p className="text-sm text-muted-foreground mt-1">Active Users This Week</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/20">
              <p className="text-4xl font-bold text-emerald-600">
                {analytics.totalUsers > 0
                  ? Math.round((analytics.activeUsersWeek / analytics.totalUsers) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">Weekly Retention Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-pink-600" />
            Skills Overview
          </CardTitle>
          <CardDescription>
            All available skills and their completion stats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillTracks.map((skill) => {
              const stats = skillsAnalytics.find(s => s.slug === skill.slug);
              const branchInfo = branches.find(b => b.id === skill.branch);
              return (
                <div key={skill.slug} className="p-4 rounded-lg border bg-card hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm">{skill.title}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs shrink-0 ${
                        skill.branch === 'CSE' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                        skill.branch === 'CSM' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                        skill.branch === 'CSD' ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' :
                        skill.branch === 'CSC' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                        skill.branch === 'ECE' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}
                    >
                      {branchInfo?.name || skill.branch}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{skill.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      <Badge variant="outline" className="mr-2">{skill.level}</Badge>
                      {skill.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{stats?.usersStarted || 0} users</span>
                      <Badge variant="secondary">{stats?.totalCompletions || 0} completed</Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-purple-600" />
              Top Searched Topics
            </CardTitle>
            <CardDescription>
              Most popular AI learning queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.popularTopics.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead className="text-right">Searches</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.popularTopics.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {item.topic.length > 40
                          ? item.topic.substring(0, 40) + "..."
                          : item.topic}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{item.count}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Popular Subjects */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-emerald-600" />
              Most Accessed Materials
            </CardTitle>
            <CardDescription>
              Subjects with highest engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.popularSubjects.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No data yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.popularSubjects.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{item.count}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
