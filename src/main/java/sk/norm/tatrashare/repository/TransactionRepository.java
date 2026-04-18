package sk.norm.tatrashare.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sk.norm.tatrashare.entity.Transaction;
import sk.norm.tatrashare.entity.User;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    @Query("SELECT t FROM Transaction t WHERE t.group.id = :groupId ORDER BY t.id")
    List<Transaction> findByGroupId(@Param("groupId") Long groupId);

    @Query("SELECT t FROM Transaction t WHERE t.id = :transactionId AND t.group.id = :groupId")
    Optional<Transaction> findByIdAndGroupId(@Param("transactionId") Long transactionId, @Param("groupId") Long groupId);

    @Query(value = "SELECT u.id, u.full_name, u.iban FROM \"user\" u JOIN transaction_payed_for tpf ON tpf.user_id = u.id WHERE tpf.transaction_id = :transactionId ORDER BY u.id", nativeQuery = true)
    List<User> findBeneficiariesByTransactionId(@Param("transactionId") Long transactionId);

    @Modifying
    @Query(value = "INSERT INTO transaction_payed_for (transaction_id, user_id) VALUES (:transactionId, :userId)", nativeQuery = true)
    void addBeneficiary(@Param("transactionId") Long transactionId, @Param("userId") Long userId);
}
