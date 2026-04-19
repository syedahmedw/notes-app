package com.ahmed.service;

import com.ahmed.entity.Note;
import com.ahmed.entity.User;
import com.ahmed.repository.NoteRepository;
import com.ahmed.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    public Note addNote(Note note) {

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        note.setUser(user);

        return noteRepository.save(note);
    }

    public List<Note> getAllNotes() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return noteRepository.findByUserUsername(username);
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }
}