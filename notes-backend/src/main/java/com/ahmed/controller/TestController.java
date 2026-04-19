package com.ahmed.controller;

import com.ahmed.entity.Note;
import com.ahmed.repository.NoteRepository;
import com.ahmed.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/notes")
public class TestController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private NoteRepository noteRepository;

    // Add note
    @PostMapping
    public Note addNote(@RequestBody Note note) {
        return noteService.addNote(note);
    }

    // Get all notes
    @GetMapping
    public List<Note> getNotes() {
        return noteService.getAllNotes();
    }

    // Delete note
    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return "Deleted successfully";
    }
    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note note) {

        Note existing = noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        existing.setTitle(note.getTitle());
        existing.setContent(note.getContent());

        return noteRepository.save(existing);
    }
}