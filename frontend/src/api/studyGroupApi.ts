import api from "./axios";
import type {
  StudyGroup,
  StudyMember,
  CreateGroupRequest,
  UpdateGroupRequest,
} from "../types/studyGroup.type";

export const studyGroupApi = {
  // 그룹 관련
  getAllGroups: (keyword?: string) =>
    api.get<StudyGroup[]>("/study-groups/list", {
      params: keyword ? { keyword } : {},
    }),
  getGroupsByCategory: (category: string, keyword?: string) =>
    api.get<StudyGroup[]>("/study-groups/list/category", {
      params: keyword ? { category, keyword } : { category },
    }),
  getMyGroups: () => api.get<StudyGroup[]>("/study-groups/my"),
  getGroup: (groupId: string) =>
    api.get<StudyGroup>(`/study-groups/${groupId}`),
  getGroupByInviteCode: (inviteCode: string) =>
    api.get<StudyGroup>(`/study-groups/invite/${inviteCode}`),
  createGroup: (data: CreateGroupRequest) =>
    api.post<StudyGroup>("/study-groups/create", data),
  updateGroup: (groupId: string, data: UpdateGroupRequest) =>
    api.put<StudyGroup>(`/study-groups/update/${groupId}`, data),
  deleteGroup: (groupId: string) =>
    api.delete(`/study-groups/delete/${groupId}`),

  // 멤버 관련
  join: (groupId: string) =>
    api.post<StudyMember>(`/study-members/${groupId}/join`),
  getMembers: (groupId: string) =>
    api.get<StudyMember[]>(`/study-members/${groupId}/members`),
  getPendingMembers: (groupId: string) =>
    api.get<StudyMember[]>(`/study-members/${groupId}/members/pending`),
  acceptMember: (groupId: string, userId: string) =>
    api.post<StudyMember>(`/study-members/${groupId}/members/${userId}/accept`),
  rejectMember: (groupId: string, userId: string) =>
    api.post(`/study-members/${groupId}/members/${userId}/reject`),
  kickMember: (groupId: string, userId: string) =>
    api.delete(`/study-members/${groupId}/members/${userId}/kick`),
  leave: (groupId: string) => api.delete(`/study-members/${groupId}/leave`),
  changeLeader: (groupId: string, newLeaderId: string) =>
    api.post(`/study-members/${groupId}/leader/${newLeaderId}`),
};
