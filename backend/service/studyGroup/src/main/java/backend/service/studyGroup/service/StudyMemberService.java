package backend.service.studyGroup.service;

import backend.service.studyGroup.dto.response.MemberResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface StudyMemberService {
    MemberResponse join(Long groupId, HttpServletRequest httpRequest);
    List<MemberResponse> getMembers(Long groupId);
    List<MemberResponse> getPendingMembers(Long groupId, HttpServletRequest httpRequest);
    MemberResponse accept(Long groupId, Long userId, HttpServletRequest httpRequest);
    void reject(Long groupId, Long userId, HttpServletRequest httpRequest);
    void kick(Long groupId, Long userId, HttpServletRequest httpRequest);
    void leave(Long groupId, HttpServletRequest httpRequest);
    void changeLeader(Long groupId, Long newLeaderId, HttpServletRequest httpRequest);
}