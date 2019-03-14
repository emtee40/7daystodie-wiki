import { Injectable } from '@angular/core';
import xmlFile from 'src/assets/Data/Config/recipes.xml.json';
import {XmlObject, XmlService} from './xml.service';

@Injectable({
  providedIn: 'root'
})
export class RecipesService extends XmlService<Recipe> {

  constructor() {
    super(xmlFile.recipes.recipe);
  }

  newElement(xmlElement: any): Recipe {
    return new Recipe(xmlElement);
  }
}

export class Recipe extends XmlObject {

  constructor(xmlElement) {
    super(xmlElement);
  }


  get ingredients(): Ingredient[] {
    return this.xmlElement.ingredient.map(xmlIngredient => new Ingredient(xmlIngredient));
  }

}

export class Ingredient extends XmlObject {

  constructor(xmlElement) {
    super(xmlElement);
  }

  get count(): number {
    return +this.$.count;
  }
}