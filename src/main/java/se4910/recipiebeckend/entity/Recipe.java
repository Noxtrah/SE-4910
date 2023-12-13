package se4910.recipiebeckend.entity;

import jakarta.persistence.*;
import lombok.Data;


@Entity(name="recipe" )
@Table(name="recipe" )
@Data
public class Recipe {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

  //  @Column(columnDefinition = "ingredients")
    private String ingredients;


    @Column(name = "description", columnDefinition = "LONGTEXT")
    private String description;


    private String cuisine;

    private String meal;

    private int preparationTime;

    private String photoPath;


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
