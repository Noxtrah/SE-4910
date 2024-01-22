package se4910.recipiebeckend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;



@Entity(name="recipe" )
@Table(name="recipe" )
@Data
public class Recipe {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

  //  @Column(columnDefinition = "ingredients")
  @Column(name = "ingredients", columnDefinition = "varchar(max)")
    private String ingredients;


   @Column(name = "description", columnDefinition = "varchar(max)")
    private String description;


    private String cuisine;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "meal_recipe",
            joinColumns = @JoinColumn(name = "recipe_id"),
            inverseJoinColumns = @JoinColumn(name = "meal_id")
    )
    private List<Meal> meal;

    private int preparationTime;

    private String photoPath;


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
