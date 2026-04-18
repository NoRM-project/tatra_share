package sk.norm.tatrashare.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Table(
        name = "\"group\"",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "name")
        }
)
@Entity
@Getter
@Setter
public class Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false)
    private String name;
}
