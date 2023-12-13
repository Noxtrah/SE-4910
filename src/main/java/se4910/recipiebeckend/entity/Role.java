package se4910.recipiebeckend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    public Role() { }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
}
