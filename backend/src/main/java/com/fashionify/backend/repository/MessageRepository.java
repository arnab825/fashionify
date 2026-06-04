package com.fashionify.backend.repository;

import com.fashionify.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    /** All messages, newest first — default view for the admin inbox. */
    List<Message> findAllByOrderByCreatedAtDesc();

    /** Unread messages only, newest first — used for the "Unread" filter tab. */
    List<Message> findByReadFalseOrderByCreatedAtDesc();

    /** Resolved messages only, newest first — used for the "Resolved" filter tab. */
    List<Message> findByResolvedTrueOrderByCreatedAtDesc();

    /** Count of unread messages — displayed as sidebar badge. */
    long countByReadFalse();
}
