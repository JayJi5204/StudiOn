import { useState, useEffect, useRef, useCallback } from 'react';
import { commentService } from '../services/comment.service';
import type { IBoardComment } from '../types/Response/board.type';

const PAGE_SIZE = 10;

export const getDepth = (commentPath: string) => 
    Math.floor(commentPath.length / 5) - 1;

export const useCommentList = (boardId: string) => {
    const [comments, setComments] = useState<IBoardComment[]>([]);
    const [lastPath, setLastPath] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const observerRef = useRef<HTMLDivElement>(null);

    const loadComments = async (currentLastPath: string | null = null) => {
        if (isLoading || !hasMore) return;
        setIsLoading(true);
        try {
            const response = await commentService.getComments({
                boardId,
                lastPath: currentLastPath ?? undefined,
                pageSize: PAGE_SIZE,
            });
            if (response.length < PAGE_SIZE) setHasMore(false);
            if (response.length === 0) return;
            setComments(prev => [...prev, ...response]);
            setLastPath(response[response.length - 1].commentPath);
        } catch (error) {
            console.error('댓글 불러오기 실패', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 최초 로딩
    useEffect(() => {
        loadComments(null);
    }, [boardId]);

    // 무한스크롤
    const observerCallback = useCallback(() => {
        if (!isLoading && hasMore) loadComments(lastPath);
    }, [isLoading, hasMore, lastPath]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) observerCallback(); },
            { threshold: 0.1 }
        );
        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [observerCallback]);

    return { comments, setComments, isLoading, observerRef };
};