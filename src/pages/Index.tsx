import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface Ingredient {
  name: string;
  calories: number;
}

interface Meal {
  id: string;
  name: string;
  time: string;
  ingredients: Ingredient[];
  totalCalories: number;
  icon: string;
}

const Index = () => {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Завтрак',
      time: '08:30',
      icon: 'Coffee',
      ingredients: [
        { name: 'Овсянка', calories: 150 },
        { name: 'Банан', calories: 105 },
        { name: 'Мёд', calories: 64 },
      ],
      totalCalories: 319,
    },
    {
      id: '2',
      name: 'Обед',
      time: '13:00',
      icon: 'Utensils',
      ingredients: [
        { name: 'Куриная грудка', calories: 284 },
        { name: 'Рис', calories: 206 },
        { name: 'Брокколи', calories: 55 },
      ],
      totalCalories: 545,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [mealName, setMealName] = useState('');
  const [mealTime, setMealTime] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({ name: '', calories: 0 });

  const dailyGoal = 2000;
  const totalConsumed = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const progressPercent = Math.min((totalConsumed / dailyGoal) * 100, 100);

  const addIngredient = () => {
    if (newIngredient.name && newIngredient.calories > 0) {
      setIngredients([...ingredients, newIngredient]);
      setNewIngredient({ name: '', calories: 0 });
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const saveMeal = () => {
    if (mealName && ingredients.length > 0) {
      const totalCalories = ingredients.reduce((sum, ing) => sum + ing.calories, 0);
      const newMeal: Meal = {
        id: Date.now().toString(),
        name: mealName,
        time: mealTime || new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        ingredients,
        totalCalories,
        icon: 'Apple',
      };
      setMeals([...meals, newMeal]);
      setMealName('');
      setMealTime('');
      setIngredients([]);
      setIsOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Icon name="Apple" size={40} className="text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Healthy Meal Tracker</h1>
          </div>
          <p className="text-muted-foreground text-lg">Ваш персональный журнал питания</p>
        </header>

        <Card className="mb-8 shadow-lg border-2 border-primary/20 animate-scale-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Icon name="TrendingUp" size={24} className="text-primary" />
              Сегодняшняя статистика
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium text-foreground">
                  {totalConsumed} / {dailyGoal} ккал
                </span>
                <span className="text-sm text-muted-foreground">
                  Осталось: {Math.max(0, dailyGoal - totalConsumed)} ккал
                </span>
              </div>
              <Progress value={progressPercent} className="h-4" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <Icon name="Flame" size={24} className="mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold text-foreground">{totalConsumed}</p>
                <p className="text-sm text-muted-foreground">Калорий</p>
              </div>
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <Icon name="Utensils" size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold text-foreground">{meals.length}</p>
                <p className="text-sm text-muted-foreground">Приёмов пищи</p>
              </div>
              <div className="bg-accent/50 rounded-lg p-4 text-center">
                <Icon name="Target" size={24} className="mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold text-foreground">{Math.round(progressPercent)}%</p>
                <p className="text-sm text-muted-foreground">От цели</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Icon name="Calendar" size={28} />
            Приёмы пищи сегодня
          </h2>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-md hover:shadow-lg transition-shadow">
                <Icon name="Plus" size={20} />
                Добавить приём пищи
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Icon name="PlusCircle" size={24} className="text-primary" />
                  Новый приём пищи
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meal-name">Название приёма пищи</Label>
                    <Input
                      id="meal-name"
                      placeholder="Например: Завтрак"
                      value={mealName}
                      onChange={(e) => setMealName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meal-time">Время</Label>
                    <Input
                      id="meal-time"
                      type="time"
                      value={mealTime}
                      onChange={(e) => setMealTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Icon name="ShoppingBasket" size={20} />
                    Ингредиенты
                  </h3>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Название ингредиента"
                      value={newIngredient.name}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, name: e.target.value })
                      }
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Калории"
                      value={newIngredient.calories || ''}
                      onChange={(e) =>
                        setNewIngredient({
                          ...newIngredient,
                          calories: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-32"
                    />
                    <Button onClick={addIngredient} size="icon" variant="secondary">
                      <Icon name="Plus" size={20} />
                    </Button>
                  </div>

                  {ingredients.length > 0 && (
                    <div className="space-y-2 bg-accent/30 rounded-lg p-4">
                      {ingredients.map((ing, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-background p-3 rounded-lg shadow-sm"
                        >
                          <span className="font-medium">{ing.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-primary font-semibold">{ing.calories} ккал</span>
                            <Button
                              onClick={() => removeIngredient(index)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="text-right pt-2 border-t">
                        <span className="text-lg font-bold text-primary">
                          Итого: {ingredients.reduce((sum, ing) => sum + ing.calories, 0)} ккал
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={saveMeal}
                  className="w-full gap-2"
                  disabled={!mealName || ingredients.length === 0}
                >
                  <Icon name="Check" size={20} />
                  Сохранить приём пищи
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {meals.map((meal, index) => (
            <Card
              key={meal.id}
              className="shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Icon name={meal.icon} size={24} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{meal.name}</h3>
                      <p className="text-sm text-muted-foreground">{meal.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{meal.totalCalories}</p>
                    <p className="text-sm text-muted-foreground">ккал</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {meal.ingredients.map((ingredient, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-accent/40 px-4 py-2 rounded-lg"
                    >
                      <span className="text-foreground">{ingredient.name}</span>
                      <span className="text-primary font-semibold">{ingredient.calories} ккал</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {meals.length === 0 && (
          <Card className="text-center py-12 shadow-md">
            <CardContent>
              <Icon name="Salad" size={64} className="mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-xl text-muted-foreground mb-4">
                Пока нет записей о приёмах пищи
              </p>
              <p className="text-sm text-muted-foreground">
                Начните отслеживать своё питание, добавив первый приём пищи
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
