package backend.service.studyGroup.service;

import backend.common.enumType.MemberStatus;
import backend.common.exception.CustomException;
import backend.common.exception.ErrorCode;
import backend.common.id.Snowflake;
import backend.common.kafkaEvent.KafkaProducer;
import backend.common.kafkaEvent.alarm.AlarmEvent;
import backend.common.util.SecurityUtil;
import backend.service.studyGroup.dto.response.MemberResponse;
import backend.service.studyGroup.entity.StudyGroupEntity;
import backend.service.studyGroup.entity.StudyMemberEntity;
import backend.service.studyGroup.repository.StudyGroupRepository;
import backend.service.studyGroup.repository.StudyMemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
public class StudyMemberServiceImpl implements StudyMemberService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyMemberRepository studyMemberRepository;
    private final KafkaProducer kafkaProducer;
    private final Snowflake snowflake = new Snowflake();

    @Override
    @Transactional
    public MemberResponse join(Long groupId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        String nickName = SecurityUtil.getNickname(httpRequest);

        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (studyMemberRepository.existsByGroupIdAndUserIdAndStatus(groupId, userId, MemberStatus.ACCEPTED)) {
            throw new CustomException(ErrorCode.ALREADY_MEMBER);
        }

        if (studyMemberRepository.existsByGroupIdAndUserIdAndStatus(groupId, userId, MemberStatus.PENDING)) {
            throw new CustomException(ErrorCode.ALREADY_PENDING);
        }

        if (group.getCurrentMembers() >= group.getMaxMembers()) {
            throw new CustomException(ErrorCode.GROUP_FULL);
        }

        StudyMemberEntity member = StudyMemberEntity.create(
                snowflake.nextId(), groupId, userId, nickName
        );
        studyMemberRepository.save(member);

        // 회장에게 가입 신청 알람
        kafkaProducer.send("alarm", new AlarmEvent(
                group.getLeaderId(),
                "STUDY_JOIN_REQUEST",
                nickName + "님이 [" + group.getGroupName() + "] 그룹에 가입을 신청했습니다.",
                groupId
        ));

        return MemberResponse.from(member);
    }

    @Override
    @Transactional
    public MemberResponse accept(Long groupId, Long userId, HttpServletRequest httpRequest) {
        Long leaderId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(leaderId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        StudyMemberEntity member = studyMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        member.accept();
        group.increaseMembers();
        studyGroupRepository.save(group);
        studyMemberRepository.save(member);

        // 신청자에게 수락 알람
        kafkaProducer.send("alarm", new AlarmEvent(
                userId,
                "STUDY_JOIN_ACCEPTED",
                "[" + group.getGroupName() + "] 그룹 가입이 승인되었습니다.",
                groupId
        ));

        return MemberResponse.from(member);
    }

    @Override
    @Transactional
    public void kick(Long groupId, Long userId, HttpServletRequest httpRequest) {
        Long leaderId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(leaderId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        if (userId.equals(leaderId)) {
            throw new CustomException(ErrorCode.CANNOT_KICK_LEADER);
        }

        StudyMemberEntity member = studyMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        studyMemberRepository.delete(member);
        group.decreaseMembers();
        studyGroupRepository.save(group);

        // 추방된 멤버에게 알람
        kafkaProducer.send("alarm", new AlarmEvent(
                userId,
                "STUDY_KICKED",
                "[" + group.getGroupName() + "] 그룹에서 추방되었습니다.",
                groupId
        ));
    }

    @Override
    public List<MemberResponse> getMembers(Long groupId) {
        return studyMemberRepository.findAllByGroupIdAndStatus(groupId, MemberStatus.ACCEPTED)
                .stream()
                .map(MemberResponse::from)
                .toList();
    }

    @Override
    public List<MemberResponse> getPendingMembers(Long groupId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        return studyMemberRepository.findAllByGroupIdAndStatus(groupId, MemberStatus.PENDING)
                .stream()
                .map(MemberResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public void reject(Long groupId, Long userId, HttpServletRequest httpRequest) {
        Long leaderId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(leaderId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        StudyMemberEntity member = studyMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        member.reject();
        studyMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void leave(Long groupId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (group.getLeaderId().equals(userId)) {
            throw new CustomException(ErrorCode.LEADER_CANNOT_LEAVE);
        }

        StudyMemberEntity member = studyMemberRepository.findByGroupIdAndUserId(groupId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEMBER_NOT_FOUND));

        studyMemberRepository.delete(member);
        group.decreaseMembers();
        studyGroupRepository.save(group);
    }

    @Override
    @Transactional
    public void changeLeader(Long groupId, Long newLeaderId, HttpServletRequest httpRequest) {
        Long userId = SecurityUtil.getCurrentUserId(httpRequest);
        StudyGroupEntity group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new CustomException(ErrorCode.GROUP_NOT_FOUND));

        if (!group.getLeaderId().equals(userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED);
        }

        if (!studyMemberRepository.existsByGroupIdAndUserIdAndStatus(groupId, newLeaderId, MemberStatus.ACCEPTED)) {
            throw new CustomException(ErrorCode.MEMBER_NOT_FOUND);
        }

        group.changeLeader(newLeaderId);
        studyGroupRepository.save(group);
    }
}