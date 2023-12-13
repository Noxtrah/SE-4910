package se4910.recipiebeckend.entity;


import jakarta.persistence.*;
import lombok.Data;

@Entity(name="user_recipes" )
@Table(name="user_recipes" )
@Data
public class UserRecipes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users_id",nullable = false)
    private User user;


    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String ingredients;

    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;

    private String cuisine;


    private String meal;


    private int preparationTime;

    private  String photoPath;

}
