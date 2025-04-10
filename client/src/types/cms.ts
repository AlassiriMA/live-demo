// CMS Types

export interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  style?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  imageUrl?: string;
  tags: string[];
  route: string;
  published: boolean;
  detailedContent?: string;
  features?: ProjectFeature[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface MediaItem {
  id: number;
  filename: string;
  fileType: string;
  fileSize: number;
  url: string;
  altText?: string;
  uploadedBy: number;
  uploadedAt: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  entityType: string;
  entityId: number;
  details?: any;
  timestamp: string;
}

export interface SiteSetting {
  id: number;
  key: string;
  value: any;
  category?: string;
  updatedBy: number;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
  createdAt: string;
}