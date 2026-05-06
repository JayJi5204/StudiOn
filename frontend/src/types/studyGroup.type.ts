export type StudyGroupCategory = "JOB" | "CERTIFICATE" | "LANGUAGE" | "ETC";

export interface StudyGroup {
  groupId: string;
  groupName: string;
  description: string;
  leaderId: string;
  category: StudyGroupCategory;
  isPrivate: boolean;
  inviteCode: string;
  maxMembers: number;
  currentMembers: number;
  dayOfWeek: string;
  studyTime: string;
  tags: string[];
  createdAt: string;
}

export interface StudyMember {
  memberId: string;
  groupId: string;
  userId: string;
  nickName: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  joinedAt: string;
}

export interface CreateGroupRequest {
  groupName: string;
  description: string;
  category: string;
  isPrivate: boolean;
  dayOfWeek: string;
  studyTime: string;
  tags: string[];
}

export interface UpdateGroupRequest {
  groupName?: string;
  description?: string;
  category?: string;
  dayOfWeek?: string;
  studyTime?: string;
  isPrivate?: boolean;
  tags?: string[];
}

export interface GroupListResponse {
  groupId: string;
  groupName: string;
  description: string;
  category: StudyGroupCategory;
  isPrivate: boolean;
  currentMembers: number;
  maxMembers: number;
  dayOfWeek: string;
  studyTime: string;
  tags: string[];
}
