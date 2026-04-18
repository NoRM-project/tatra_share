package sk.norm.tatrashare.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

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

    @OneToMany(mappedBy = "group")
    @JsonIgnore
    private Set<GroupUser> groupUsers;
}
