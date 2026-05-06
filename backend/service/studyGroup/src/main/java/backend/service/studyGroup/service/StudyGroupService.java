package backend.service.studyGroup.service;

import backend.service.studyGroup.dto.request.CreateGroupRequest;
import backend.service.studyGroup.dto.request.UpdateGroupRequest;
import backend.service.studyGroup.dto.response.GroupListResponse;
import backend.service.studyGroup.dto.response.GroupResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface StudyGroupService {
    GroupResponse create(CreateGroupRequest request, HttpServletRequest httpRequest);
    GroupResponse getGroup(Long groupId);
    List<GroupListResponse> getAllGroups(String keyword);
    List<GroupListResponse> getGroupsByCategory(String category, String keyword);
    List<GroupListResponse> getMyGroups(HttpServletRequest httpRequest);
    GroupResponse update(Long groupId, UpdateGroupRequest request, HttpServletRequest httpRequest);
    void delete(Long groupId, HttpServletRequest httpRequest);
    GroupResponse getGroupByInviteCode(String inviteCode);
}