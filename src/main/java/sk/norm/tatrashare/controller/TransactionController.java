package sk.norm.tatrashare.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sk.norm.tatrashare.dto.CreateTransactionRequest;
import sk.norm.tatrashare.dto.TransactionDto;
import sk.norm.tatrashare.service.TransactionService;

import java.util.List;

@RestController
@RequestMapping("/api/groups/{groupId}/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<TransactionDto> getTransactions(@PathVariable Long groupId) {
        return transactionService.getGroupTransactions(groupId);
    }

    @PostMapping
    public TransactionDto createTransaction(@PathVariable Long groupId,
                                            @RequestBody @Valid CreateTransactionRequest request) {
        return transactionService.createGroupTransaction(groupId, request);
    }

    @GetMapping("/{transactionId}")
    public TransactionDto getTransaction(@PathVariable Long groupId,
                                         @PathVariable Long transactionId) {
        return transactionService.getGroupTransaction(groupId, transactionId);
    }
}

