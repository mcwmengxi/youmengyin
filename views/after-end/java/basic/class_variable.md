# 类变量和类方法
## 类变量和类方法
```java
class Child {
  private String name;

  // 该变量最大的特点就是会被 Child 类的所有的对象实例共享
  public static int count = 0;
  public Child(String name) {
    this.name = name;
  }
  public void join() {
    System.out.println(name + "加入了游戏...");
  }
}

public static void main(String[] args) {
  Child child1 = new Child("小明");
  child1.join();
  child1.count++;

  Child child2 = new Child("小红");
  child2.join();
  child2.count++;

  Child child3 = new Child("小亮");
  child3.join();
  child3.count++;

  // 类变量可以通过类名直接访问
  System.out.println("游戏玩家数量：" + Child.count);
```
static 变量是对象共享不管static变量在哪里
1. static 变量是同一个类所有对象共享
2. static 类变量，在类加载的时候就生成了。

### 类变量
类变量也叫静态变量/静态属性，是该类的所有对象共享的变量，任何一个该类的对象去访问它时，取到的都是相同的值，同样任何一个该类的对象去修改它时，修改的也是同一个变量

### 定义类变量
- 访问修改符 static 数据类型 变量名;
- static 访问修饰符 数据类型 变量名;
### 如何访问类变量
类名.类变量名 或者 对象名.类变量名(静态变量的访问修饰符的访问权限和范围和普通属性是一样的)。推荐使用：类名.类变量名

```java
class A {
  public static String name = "张三"
}

public class Test {
  public static void main(String[] args) {
    // 类变量是随着类的加载而生成的，所以可以直接通过类名访问。没有创建实例也可以访问
    System.out.println(A.name)
    A a = new A()
    System.out.println(a.name)

  }
}


```

### 类变量使用注意事项和细节讨论
1. 什么时候需要要用类变量
  当我们吉布森发让某个类的所有对象都共享一个变量时， 就可以考虑使用类变量(静态变量)：比如：定义学生类，统计所有学生共交多少钱。Student (name, fee)
2. 类变量与实例变量(普通属性)的区别
  - 类变量是该类的所有对象共享的，而实例变量是每个对象独享的。
3. 加上static称为类变量或静态变量，否则称为实例变量/普通变量/非静态变量
4. 变就是可以通过 `类名.类变量名` 访问的，也可以通过 `对象名.类变量名` 访问。但 java 设计者推荐我们使用 `类名.类变量名` 访问(前提时 满足访问修改符的访问权限和范围)
5. 实例变量不能通过 类名.实例变量名` 访问
6. 类变量是在类加载时就初始化了，也就是说，即使你没有创建对象，只要类加载了，就可以使用类变量了。
7. 类变量的生命周期是随类的加载开始，随着类消亡而销毁。

### 类方法基本介绍
类方法也叫静态方法，形式如下：
```java
/**
 * 访问修改符 static 数据返回类型 方法名(参数列表){} 推荐
 * static 访问修饰符 数据返回类型 方法名(参数列表){}
 * class B {
 *   public static void printStart() {
 *     System.out.println("start...");
 *   }
 * }
 */
```
类方法的调用：类名.类方法名(推荐使用) 或者 对象名.类方法名
```java

public Stu {
  private String name; // 普通成员
  // 定义一个静态变量，来累积学生的学费
  private static double fee = 0;

  public Stu(String name) {
    this.name = name;
  }

  // 1. 当方法使用 static 修饰时，该方法就是一个类方法，也称为静态方法
  // 2. 静态方法可以访问静态变量，但是不能直接访问实例变量
  public static void payFee(double fee) {
    // 累积学生的学费
    Stu.fee += fee;
  }

  public void showFee() {
    System.out.println("总学费有：" + Stu.fee)
  }
}

public static void main(String[] args) {
  Stu stu = new Stu("小明");
  tom.payFee(100);

  Stu mary = new Stu('mary')
  mary.payFee(200);

  // 输出当前得到的总学费
  Stu.showFee();
}
```
### 类方法经典的使用场景
当方法中不涉及不对劲任何和对象相关的成员，则可以将方法设计成静态方法，提高开发效率。
```java
class MyTools {
  public double calSum(double n1, double n2) {
    return n1 + n2;
  }
}
```
### 类方法注意事项
1. 类方法和普通方法都是随着类的加载而加载，将结构信息存储在方法区：
  - 类方法中无this的参数
  - 普通方法中隐含着this的参数
2. 类方法可以通过类名调用，也可以通过对象名调用。
3. 普通方法和对象有关，需要通过对象名调用，比如`对象名.方法名(参数)`, 不能通过类名调用。
4. 类方法中不能使用和对象有关的关键字，比如this和super关键字。普通方法(成员方法)可以。
5. 类方法(静态方法)中只能访问静态变量或静态方法。
6. 普通成员方法，既可以访问普通变量(方法)，也可以访问静态变量(方法)。

> 小结：静态方法，只能访问静态的成员，非静态的方法，可以访问静态成员和非静态成员(必须遵守访问权限)
```java
public class Test {
  static int ccount = 9;
  public void count() {
    System.out.println("count..." + (count++));
  }

  public static void main(String[] args) {
    new Test().count();
    new Test().count();
    System.out.println(Test.count);
  }
  }

}

// 2
class Person {
  private int id;
  private static int total = 0;
  public static int getTotalPerson() {
    // id++; // 错误
    retrun total;
  }
  public Person() {
    total++;
    id = total;
  }
}

public class TestPerson {
  public static void main(String[] args) {
    System.out.println('Number of total is ' + Person.getTotalPerson()); // 0
    Person p1 = new Person();
    System.out.println('Number of total is ' + Person.getTotalPerson()); // 1
  }
}
```
## 理解 main 方法语法 static 
`public static void main(String[] args) {}`
1. java虚拟机需要调用类的main() 方法，所以该方法的访问权限必须是 public 
2. java 虚拟机在执行 main() 方法时不必创建对象，所以该方法必须是 static 
3. 该方法接收String 类型的数组参数，该数组中保存执行 java 命令时传递给所运行的类的参数
4. `java 执行的程序 参数1 参数2 参数3`
```java
// 通过命令行储运这个代码 并且多传递三个参数
public class Hello {
  public static void main(String[] args) {
    for (int i = 0; i < args.length; i++) {
      System.out.println("第" + (i + 1) + "个参数 = " + args[i])
    }
  }
}
```
5. 在 main() 方法中，我们可以直接调用 main 方法所有类的静态方法或静态属性
6. 但是，不能直接访问该类中的非静态成员，必须创建该类的一个实例对象后，才能通过这个对象去访问类中的非静态成员。

## 代码块
代码块又称为`初始化块`，属于类中的成员[即是类的一部分], 类似于方法，将逻辑语句封装在方法体中，通过`{}`包围起来。但和方法不同，没有方法名，没有返回，没有参数，只有方法体，而且不用通过对象或类显式调用，而是加载类时，或创建对象时隐式调用。
### 基本语法
```java
/**
 * [修改符] {
 *   代码
 * }
 * 1. 修饰符 可选，要写的话，也只能写 static
 * 2. 代码块分为两类，使用 static 修改的叫静态代码块，没有static 修改的，叫普通代码块。
 * 3. 逻辑语句上可以为任何逻辑语句(输入、输出、方法调用、循环、判断等)
 * 4. ;号可以写上，也可以省略。
 */
```
### 代码块的好处
1. 相当于另外一种形式的构造器(对构造器的补充机制)，可以做初始化的操作
2. 如果多个构造器中都有重复的语句，可以抽取到初始化块中，提高代码的重用性
```java
class Movie {
  private String name;
  private double price;
  private String director;


  // 这样不管调用哪个构造器，创建对象，都会执行下面的代码块
  // 代码块调用的顺序优先于构造器
  {
    System.out.println('电影屏幕打开...')
    System.out.println('广告开始...')
    System.out.println('电影正式开始...')
  }
  // 下面的三个构造器都有相同的语句
  // 这样代码看起来比较冗余
  // 这时我们可以把相同的语句，放入到一个代码块中，即可

  public Movie (String name) {
    System.out.println('电影屏幕打开...')
    System.out.println('广告开始...')
    System.out.println('电影正式开始...')
    this.name = name;
  }

  public Movie (String name, double price) {
    System.out.println('电影屏幕打开...')
    System.out.println('广告开始...')
    System.out.println('电影正式开始...')
    this.name = name;
    this.price = price;
  }

  public Movie (String name, double price, String director) {
    System.out.println('电影屏幕打开...')
    System.out.println('广告开始...')
    System.out.println('电影正式开始...')
    this.name = name;
    this.price = price;
    this.director = director;
  }
}
```
### 代码块的注意事项
1. static 代码块也叫静态代码块，作用就是对类进行初始化，而且它随着类的加载面执行，并且只会执行一次。如果是普通代码块，每创建一个对象，就执行。
2. 类什么时候初始加载
  - 创建对象实例时(new)
  - 创建子类对象实例，父类也会被加载
  - 使用类的静态成员时(静态属性，静态方法)

```java

class AA {
  static {
    System.out.println('AA 的静态代码块...')
  }
}

class BB extends AA {
  static {
    System.out.println('BB 的静态代码块...')
  }
}

class Cat {
  public static int n1 = 999;

  static {
    System.out.println('Cat 的静态代码块...')
  }
}
public static void main(String[] args) {
  // 1. 创建对象实例
  AA aa = new AA();

  // 2. 创建子类对象实例, 而且，父类先被加载，子类再进行加载
  BB bb = new BB();

  // 3. 使用类的静态成员时
  System.out.println(Cat.n1);
}
```

3. 普通的代码块，在创建对象实例时，会被隐式的调用, 初创建一次，就会调用一次。如果只是使用类的静态成员时，普通代码块并不会执行。
4. static 代码块是类加载时，执行，只会执行一次；普通代码块是在创建对象时调用的，创建一次，调用一次
5. 创建一个对象时，在一个类调用顺序是:
  - 调用静态代码块和静态属性初始化(注意：静态代码块和静态属性初始化调用的优先级一閪，如果有多个静态代码块和多个静态变量初始化，则按他们定义的顺序调用)
  - 调用普通代码块和普通属性的初始化(注意：普通代码块和普通属性初始化调用的优先级一样，如果有多个普通代码块和多个普通属性初始化，则安排好定义顺序调用)
  - 调用构造器

```java
class A {
  // 静态属性的初始化
  private static int n1 = 999;
  private static int n2 = getN1();
  private int n3 = getN2(); // 普通属性的初始化

  // 静态代码块
  static {
    System.out.println('A 的静态代码块...')
  }

  public static int getN1() {
    System.out.println('getN1...')
    return 1000;
  }

  public int getN2() { // 普通方法
    System.out.println('getN2...')
    return 2000;
  }
}
```
6. 构造方法(构造器)的最前面其实隐含了`super()` 和调用普通代码块
```java
class AAA {
  {
    System.out.println('AAA 的普通代码块...')
  }
  public AAA() {
    super();
    // 调用普通代码块
    System.out.println('AAA 的构造器...')
  }
}

class BBB extends AAA {
  {
    System.out.println('BBB 的普通代码块...')
  }
  public BBB () {
    System.out.println('BBB 的构造器...')
  }
}

public class Test {
  public static void main(String[] args) {
    BBB bbb = new BBB();
  }
}
```
7. 创建一个子类时(继承关系)，他们的静态代码块，静态属性的初始代，普通代码块，普通属性初始化，构造方法的调用顺序如下：
  - 父类的静态代码块和静态属性(优先级一样，按定义顺序调用)
  - 子类的静态代码块和静态属性(优先级一样，按定义顺序调用)
  - 父类的普通代码块和普通属性(优先级一样，按定义顺序调用)
  - 父类的构造方法
  - 子类的普通代码块和普通属性(优先级一样，按定义顺序调用)
  - 子类的构造方法
8. 静态代码块只能直接调用静态成员(静态属性和静态方法)，普通代码块可以调用任意成员。

## 单例设计模式

## final 关键字

## 抽象类

## 接口

## 内部类