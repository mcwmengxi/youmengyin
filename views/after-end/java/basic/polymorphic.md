# 多态

## 介绍
方法或对象具有多种形态。是面向对象的第三大特征，多态是建立在封装和继承基础之上的。

## 使用重载体现多态
```java
class B {
  public void say() {
    System.out.println("B say");
  }
}

class A extends B {
  public int sum(int n1, int n2) {
    return n1 + n2;
  }

  public int sum(int n1, int n2, int n3) {
    return n1 + n2 + n3;
  }
}

public static void main(String[] args) {
  A a = new A();
  // 这里传入不同的参数，应付调用不同sum方法，就体现金矿
  System.out.println(a.sum(1, 2));
  System.out.println(a.sum(1, 2, 3));
}

```
## 使用重写体现多态

```java
class B {
  public void say() {
    System.out.println("B say");
  }
}

class A extends B {
  public void say() {
    System.out.println("A say");
  }
}

public static void main(String[] args) {
  // 使用重写实现多态
  B b = new B();
  a.say();
  b.say();
}

```

## 对象的多态
1. 一个对象的编译类型和运行类型可以不一致
2. 编译类型在定义对象时，就确定了，不能改变
3. 运行类型是可以变化的。
4. 编译类型看定义时`=` 号的左边，运行类型看 `=` 号的右边
```java
/**
 * animal 编译类型是 Animal, 运行类型Dog
 * Animal animal = new Dag();
 * 
 * animal2 的运行类型变成了Cat, 编译类型仍然是Animal
 * Animal animal2 = new Cat();
 */

public class Animal {
  public void cry() {
    System.out.println('Animal cry() 动物在叫...')
  }
}

public class Cat extends Animal {
  public void cry() {
    System.out.println('Cat cry() 小猫喵喵叫...')
  }
}

public class Dog extends Animal {
  public void cry() {
    System.out.println('Dog cry() 小狗汪汪叫...')
  }
}

public static void main(String[] args) {
  // animal 编译类型就是 Animal, 运行类型是 Dog
  Animal animal = new Dog();
  animal.cry(); // Dog cry() 小狗汪汪叫...

  // animal 编译类型 Animal, 运行类型 Cat
  animal = new Cat();
  animal.cry(); // Cat cry() 小猫喵喵叫...

}

```

## 多态案例
```java
public void feed(Animal animal, Food food) {
  Systeom.out.println("主人" + name + "给" + animal.getName() + "喂" + food.getName()) 
}
```

## 多态注意事项和细节讨论
- 多态的前提是：两个对象(类)存在继承关系

- 多态的向上转型
  1. 本质：父类的引用指向了子类的对象
  2. 语法：`父类类型 引用名 = new 子类的对象()`
  3. 特点：编译类型看左边，运行类型看右边。可以调用父类中的所有成员(需遵守访问权限)，不能调用子类中特有成员；最终运行效果看子类的具体实现！


### 向上转型
```java
public class Animal {
  String name = '动物'
  int age = 10
  public void sleep() {
    System.out.println('睡')
  }

  public void run() {
    System.out.println('跑')
  }

  public void eat() {
    System.out.println('吃')
  }

  public void show() {
    System.out.println('Hello, 你好')
  }
}

public class Cat extends Animal {
  public void eat() {
    System.out.println('猫吃鱼')
  }

  public void catchMouse() {
    System.out.println('猫抓老鼠')
  }
}

public class PolyDetail {
  public static void main(String[] args) {
    // 向下转型：父类的引用指向了子类的对象
    Animal animal = new Cat();

    Object obj = new Cat();

    // 可以调用父类的所有成员，但是不能调用子类的特有的成员
    // 因为在编译阶段，能调用哪些成员，是由编译类型决定的
    animal.eat(); // 猫吃鱼
  }
}
``
### 向下转型

1. `语法：子类类型 引用名 = (子类类型) 父类引用`
2. 只能强转父类的引用，不能强转父类的对象
3. 要求父类的引用必须指向的是当前目标类型的对象
4. 当向下转型后，可以调用子类类型中所有的成员方法

```java
...
// cat 的编译类型是 Cat, 运行类型是 Cat
Cat cat = (Cat) animal;
cat.catchMouse(); // 要求父类的引用必须指向的是当前目标类型的对象
...

```

## 属性的重写问题
- 属性没有重写之说
- instanceOf 比较操作符，用于判断对象的类型是否为`XX`类型或`XX`类型的子类型

```java
class Base {
  int count = 10;
}

class Sub extends Base {
  int count = 20;
}

public static void main(String[] args) {
  Base base = new Sub();
  System.out.println(base.count); // 10

  Sub sub = new sub();

  System.out.println(sub.count); // 20
}
```
```java
class AA {}

class BB extends AA {}

public class PolyDetail {
  public static void main(String[] args) {
    BB bb = new BB();

    System.out.println(bb instanceof BB); // true
    System.out.println(bb instanceof AA); // true

    // aa 编译类型是 AA, 运行类型是 BB
    AA aa = new BB();
    System.out.println(aa instanceof AA); // true
    System.out.println(aa instanceof BB); // true  

    Object obj = new Object();
    System.out.println(obj instanceof AA); // false
    String str = 'hello'
    System.out.println(str instanceof Object); // true
  }
}
```
```java
class Base {
  int count = 10;
  public void display() {
    System.out.println(this.count)
  }
}

class Sub extends Base {
  int count = 20;
  public void display() {
    System.out.println(this.count)
  }
}

public static void main(String[] args) {
  Sub s = new Sub();
  System.out.println(s.count); // 20
  s.display(); // 20

  Base b = s;
  System.out.println(b == s) // T
  System.out.println(b.count); // 10
  b.display(); // 10
}
```

## 动态绑定机制
1. 当调用对象方法的时候，该方法会和该对象的内存地址，即运行类型绑定
2. 当调用对象属性时，没有动态绑定机制，哪里声明，哪里使用。
```java
class A {
  public int i = 10;
  public int sum() {
    return getI() + 10;
  }

  public int sum1() {
    return i + 10;
  }

  public int getI() {
    return i;
  }
}

class B extends A {
  public int i = 20;
  public int sum() {
    return i + 20;
  }

  public int sum1() {
    return i + 10;
  }

  public int getI() {
    return i;
  }
}

public static void main(String[] args) {
  // a 的编译类型是 A，运行类型是 B
  A a = new B(); // 向上转型
  System.out.println(a.sum()); // 40
  System.out.println(a.sum1()); // 30
  // 将子类的 sum 注释会打印什么

  // 将子类的 sum1 注释会打印什么
}
```

## 多态数组
数组的定义类型为父类类型，里面保存的实际元素类型为子类类型

```java
/**
 * 现有一个继承结构如下：要求创建1个Person对象，2个Student对象，和2个Teacher对象，统一放在数组中，新营市say方法。
 * 如何调用子类特有的方法，比如Teacher 有一个 teach, Sudent 有一个 study, 怎么调用
 */

public class Person {
  private String name;
  private int age;

  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getAge() {
    return age;
  }

  public void setAge(int age) {
    this.age = age;
  }

  public String say() { // 返回名字和年龄
    return name + "\t" + age;
  }
}

public class Student extends Person {
  private double score;

  public Student(String name, int age, double score) {
    super(name, age);
    this.score = score
  }

  public double getScore() {
    return score;
  }

  public void setScore(double score) {
    this.score = score;
  }

  public String say() { // 返回名字和年龄和成绩
    return super.say() + "\t" + "say = " + score;

  }

  public void study() {
    System.out.println("学生" + getName() + "正在学习");
  }
}

public class Teacher extends Person {
  private double salary;

  public Teacher(String name, int age, double salary) {
    super(name, age);
    this.salary = salary;
  }

  public double getSalary() {
    return salary;
  }

  public void setSalary(double salary) {
    this.salary = salary;
  }

  public String say() { // 返回名字和年龄和薪水
    return super.say() + "\t" + "salary = " + salary;
  }

  public void teach() {
    System.out.println("老师" + getName() + "正在授课");
  }
}


public class Main {
  public static void main(String[] args) {
    Person[] persons = new Person[5];
    persons[0] = new Person("jack", 20);

    persons[1] = new Student("rose", 18, 100);
    persons[2] = new Student("smith", 19, 30.1);

    persons[3] = new Teacher("scott", 30, 20000);
    persons[4] = new Teacher("king", 50, 25000);

    // 循环遍历多态数组，调用say
    for (int i = 0; i < persons.length; i++) {
      // person[i] 编译类型 是 Person, 运行类型是根据实际情况决定的
      persons[i].say(); // 动态绑定机制

      // 判断 person[i] 的运行类型是否是 Student
      if (persons[i] instanceof Student) {
        // 是 Student 类型，则向下转型
        Student student = (Student) persons[i];
        student.study();
      }

      // 判断 person[i] 的运行类型是否是 Teacher
      if (persons[i] instanceof Teacher) {
        // 是 Teacher 类型，则向下转型
        Teacher teacher = (Teacher) persons[i];
        teacher.teach();
      }
    }
  }
  
}
```

## 多态参数
方法定义的形参类型为父类类型，实参类型允许为子类类型。
```java
/**
 * 定义员工类Employee, 包含姓名和月工资[private], 以及计算年工资getAnnual()的方法。
 * 普通员工和经理继承了员工，经理类多了资金bonus属性和管理manage()方法。
 * 普通员工类我了work方法，普通员工和经理类要求分别重写getAnnual()方法。
 * 
 * 测试类中添加一个方法 showEmpAnnal(Employee e), 实现获取任何员工对象的年工资，并在main方法中调用该方法[e.getAnnual()]
 * 
 * 测试类中添加一个方法，testWork, 如果是普通员工，则调用work方法，如果是经理，则调用manage方法。
 */

public class Employee {
  private String name;
  private double salary;

  public Employee(String name, double salary) {
    this.name = name;
    this.salary = salary;
  }

  // 得到年工资的方法
  public double getAnnual() {
    return 12 * salary;
  }

  public String getName() {
    return name;
  }

  public double getSalary() {
    return salary;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setSalary(double salary) {
    this.salary = salary;
  }
}

public class Worker extends Employee {
  public Worker(String name, double salary) {
    super(name, salary);
  }

  public void work() {
    System.out.println("普通员工" + getName() + "正在工作");
  }

  public double getAnnual() {
    return super.getAnnual();
  }
}

public class Manager extends Employee {
  private double bonus;

  public Manager(String name, double salary, double bonus) {
    super(name, salary);
    this.bonus = bonus;
  }

  public double getBonus() {
    return bonus;
  }

  public void manage() {
    System.out.println("经理" + getName() + "正在管理");
  }

  public double getAnnual() {
    return super.getAnnual() + bonus;
  }
}

public class PlayParametes {
  public static void main(String[] args) {
    Worker tom = new Worker("Tom", 2500);
    Manager malan = new Manager("milan", 5000, 200000);
    PloyParameter ployParameter = new PloyParameter();
    ployParameter.showEmpAnnual(tom);
    ployParameter.showEmpAnnual(malan);

    ployParameter.testWork(tom);
    ployParameter.testWork(malan); 
  }

  public void showEmpAnnual(Employee employee) {
    System.out.println(employee.getAnnual());
  }

  public void testWork (Employee employee) {
    if (e instanceof Worker) {
      ((Worker) e).work();
    } else if (e instanceof Manager) {
      ((Manager) e).manage();
    } else {
      System.out.println("该员工没有相应的操作方法");
    }
  }
}
```

## `==` 运算符
`==`是一个比较运算符
1. `==` 既可以判断基本类型，又可以判断引用类型
2. `==` 如果判断基本类型，判断的是值是否相等
3. `==` 如果判断引用类型，判断的是地址是否相等，即判断是不是同一个对象

```java

class A {}

class B extends A { }

public static void main(String[] args) {
  A a = new A();
  A b = a;
  A c = b;
  System.out.println(a == c); // true

  B bObj = a;
  System.out.println(bObj == c); // true

  int num1 = 10;
  double num2 = 10.0;
  System.out.println(num1 == num2); // true
}

```
## 子类重写 equals 方法
1. equals: 是 Object 类中的方法，只能判断引用类型
2. 默认判断的是地址是否相等，子类中往往重写该方法，用于判断内容是否相等
```java
/**
 * 判断两个 Person 对象的内容是否相等，如果两个 Person 对象的各个属性值都一样，则返回 true, 反之返回 false
 */

class Person {
  private String name;
  private int age;
  private char gender;

  public Person(String name, int age, char gender) {
    this.name = name;
    this.age = age;
    this.gender = gender;
  }

  // 重写Object 的 equals 方法
  public boolean equals(Object obj) {
    // 如果如果比较的两个对象是同一个对象，则返回 true
    if (this == obj) {
      return true;
    }

    // 类型判断
    if(obj instanceof Person) { // 是Person, 才可以比较
      // 进行向下转型，因为我需要得到Obj的各个属性
      Person p = (Person) obj;

      return this.name.equals(p.name) && this.age == p.age && this.gender == p.gender;
    }

    return false;
  }

  public String getName() {
    return name;
  }
  public void setName(String name) {
    this.name = name;
  }
  public int getAge() {
    return age;
  }
  public void setAge(int age) {
    this.age = age;
  }
  public char getGender() {
    return gender;
  }
  public void setGender(char gender) {
    this.gender = gender;
  }
}

public class Main {
  public static void main(String[] args) {
    Person p1 = new Person("jack", 10, '男');
    Person p2 = new Person("jack", 10, '男');

    // Object 类中的 equals 方法
    System.out.println(p1.equals(p2)); // false
  }
}
```

```java

class Person {
  private String name;
}

public class Main {
  public static void main(String[] args) {
    Person p1 = new Person();
    p1.name = "hspedu";

    Person p2 = new Person();
    p2.name = "hspedu";

    System.out.println(p1 === p2); // false
    System.out.println(p1.name.equals(p2.name)); // true
    System.out.println(p1.equals(p2)) ; // false

    String s1 = new String("asdf");
    String s2 = new String("asdf");
    System.out.println(s1.equals(s2)); // true
    System.out.println(s1 === s2); // false
  }
}
```
## hashCode 方法
1. 提高具有哈希结构的容器的效率！
2. 两个引用，如果指向的是同一个对象，则哈希值肯定是一样的！
3. 两个引用，如果指向的是不同对象，则哈希值是不一样的
4. 哈希值主要根据地址号来的！不能完全将哈希值等价于地址
```java
class AA {}

public class Main {
  public static void main(String[] args) {
    AA a1 = new AA();
    AA a2 = new AA();
    AA a3 = a1;

    System.out.println(a1.hashCode()); // 11686312
    System.out.println(a2.hashCode()); // 11686313
    System.out.println(a3.hashCode()); // 11686312
  }
}
```

## toString
默认返回: `全类名 + @ + 哈希值的十六进制`，子类往往重写toString方法，用于返回对象的属性值。打印对象或拼接对象时，都会自动调用该对象的toString形式
```java
public String toString() {
  // getClass().getName() 类的全类名(包名 + 类名)
  // Integer.toHexString(hashCode()) 对象的hashCode值转成 16 进制字符串
  return getClass().getName() + "@" + Integer.toHexString(hashCode());
}

class Monster {
  private String name;
  private String job;
  private double sal;

  public Monster(String name, String job, double sal) {
    this.name = name;
    this.job = job;
    this.sal = sal;
  }


  // 重写 toString 方法, 输出对象的属性
  public String toString() {
    return "Monster{name='" + name + "', job='" + job + "', sal=" + sal + '}';
  }

}


new Monster("小妖怪", "巡山", 1000)
System.out.println(monster.toString() + ' hashcode=' + monster.hashCode());
```
当直接输出一个对象时，toString方法会被默认的调用

## finalize
1. 当对象被回收时，系统自动调用该对象的finalize方法。子类可以重写该方法，做一皯释放资源的操作
2. 什么时候被回收：当某个对象没有任何引用时，则jvm就认为这个对象是一个垃圾对象，就会使用垃圾回收机制来销毁对象，在销毁该对象前，会先调用地inalize方法
3. 垃圾回收机制的调用，是由系统来决定，也可以通过System.gc() 方法触发垃圾回收机制。

```java
public class Finalize_ {
  public static void main() {
    Cass bmw = new Car("宝马")；
    bmw = null; // 这时 car 对象就是一个垃圾，垃圾回收器就会加收(销毁)对象，在 销毁对象前，
    // 会调用该对象的 finalize方法，程序员就可以在 finalize 中，写自己的业务逻辑代码(比如释放资源，数据库连接，或者打开文件...)
    // 如果程序员不重写 finalize, 那么就会调用 Object 类的 finalize, 即默认处理
    // 如果程序员重写了 finalize, 就可以实现自己的逻辑
    System.gc();
  }
}

class Car{
  private String name;
  public Car (String name) {
    this.name = name;
  }

  protected void finalize() throws Throwable {
    System.out.println("我们销毁 汽车" + name)
    System.out.println("释放了某些资源...")
  }
}
```