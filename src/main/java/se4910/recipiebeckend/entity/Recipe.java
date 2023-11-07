package se4910.recipiebeckend.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;

@Entity
@Table(name="recipe")
@Data
public class Recipe {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

  //  @Column(columnDefinition = "ingredients")
    private String ingredients;

    @Lob
   // @Column(columnDefinition = "description")
    private String description;

    private String cuisine;

    private String meal;

    private int preparationTime;

    @Lob
    byte[] photoData;


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
}
