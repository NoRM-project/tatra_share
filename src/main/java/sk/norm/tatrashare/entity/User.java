package sk.norm.tatrashare.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(name = "\"user\"")
@Entity
@Getter
@Setter
public class User {

    @Id
    private Long id;
    @Column(name = "full_name", nullable = false)
    private String full_name;
    @Column(nullable = false, unique = true)
    private String iban;
}
