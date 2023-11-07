package se4910.recipiebeckend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name="user_recipes")
@Data
public class UserRecipes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id",nullable = false)
    private User user;


    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String ingredients;

    @Lob
    private String description;


    private String cuisine;


    private String meal;


    private int preparationTime;

    @Lob
    byte[] photoData;

}
