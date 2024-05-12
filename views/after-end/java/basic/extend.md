# 继承

## 继承案例

```java
// 父类，是 Pupil 和 Graduate 的父类
public class Student {
  // 共有属性
  public String name;
  public int age;
  private double score;

  // 共有方法
  public void setScore(double score) {
    this.score = score;
  }

  public void showInfo() {
    System.out.println("姓名：" + name + "，年龄：" + age + "，成绩：" + score);
  }
}
```

```java
// 让 Pupil 继承 Student 类
public class Pupil extends Student {
  public void testing() {
    System.out.println('小学生' + name + " 正在考小学数学...")
  }
}
```

```java
// 让 Graduate 继承 Student 类
public class Graduate extends Student {
  public void doingResearch() {
    System.out.println('研究生' + name + " 正在做学术研究...")
  }
}
```

## 继承的优点
1. 代码的复用性提高了
2. 代码的扩展性和维护性提高了

## 继承的细节
### 1. 子类继承了所有的属性和方法，`非私有属性和方法可以在子类直接访问`，但是私有属性不能在子类直接访问，要通过父类提供的公共的方法去访问
```java
public class Base {
  // 4个属性
  public int n1 = 100;
  protected int n2 = 200;
  int n3 = 300;
  private int n4 = 400;

  // 无参构造器
  public Base () {
    System.out.println("base().....");
  }

  // 父类提供一个 public 的方法, 返回 n4
  public int getN4() {
    return this.n4;
  }

  public void test100() {
    System.out.println("test100().....");
  }
  
  protected void test200() {
    System.out.println("test200().....");
  }
  
  void test300() {
    System.out.println("test300().....");
  }
  
  private void test400() {
    System.out.println("test400().....");
  }

  public void callTest400() {
    // 调用私有方法
    test400();
  }
}
```

```java
public class Sub extends Base {
  public void Sub() {
    System.out.println("sub().....");
  }

  public void sayOk () {
    // 非私有属性和方法可以在子类直接访问，但是私有属性不能在子类直接访问
    System.out.println(n1 + " " + n2 + " " + n3 + " " + n4)
    System.out.println(n1 + " " + n2 + " " + n3)

    test100();
    test200();
    test300();
    // test400();

    System.out.println(getN4());
    callTest400();
  }
}
```

```java
public static void main(String[] args) {
  Sub sub = new Sub();
  sub.sayOk();
}
```
### 2. 子类必须调用父类的构造器，完成父类的初始化。

### 3. 当创建子类对象时，不管使用子类的哪个构造器，默认情况下总会去调用父类的无参构造器，如果父类没有提供无参构造器，则必须在子类的构造器中用`super()`去指定使用父类的哪个构造器完成对父类的初始化工作, 否则，编译不会通过
#### 案例1
```java
public class Sub extends Base {
  public void Sub() {
    System.out.println("sub().....");
  }

  public Sub(String name) {
    // do nothing...
    System.out.println("sub(String name).....");
  }

  public void sayOk () {
    // 非私有属性和方法可以在子类直接访问，但是私有属性不能在子类直接访问
    System.out.println(n1 + " " + n2 + " " + n3 + " " + n4)
    System.out.println(n1 + " " + n2 + " " + n3)

    test100();
    test200();
    test300();
    // test400();

    System.out.println(getN4());
    callTest400();
  }
}

```

```java
// 调用
public static void main(String[] args) {
  Sub sub = new Sub();
  Sub sub2 = new Sub("Tom");
}
```

#### 案例2
```java
public class Base {
  // 4个属性
  public int n1 = 100;
  protected int n2 = 200;
  int n3 = 300;
  private int n4 = 400;

  // 无参构造器
  public Base (String name) {
    System.out.println("base(String name).....");
  }

  // 父类提供一个 public 的方法, 返回 n4
  public int getN4() {
    return this.n4;
  }

  public void test100() {
    System.out.println("test100().....");
  }
  
  protected void test200() {
    System.out.println("test200().....");
  }
  
  void test300() {
    System.out.println("test300().....");
  }
  
  private void test400() {
    System.out.println("test400().....");
  }

  public void callTest400() {
    // 调用私有方法
    test400();
  }
}
```

```java
public class Sub extends Base {
  public Sub() {
    super("Tom");
    System.out.println("sub().....");
  }

  public Sub(String name) {
    super(name);
    System.out.println("sub(String name).....");
  }
}
```
### 4. 如果希望指定去调用父类的某个构造器，则显式的调用一下：`super(参数列表)`
```java
public Base {
  ...
  
  public Base() {}
  public Base(String name, int age) {}
  public Base(String name) {}
  
  ...
}
```

```java
public class Sub extends Base {
  public Sub() {
    
  }


  public Sub(String name, int age) {
    // 调用父类的无参构造器，什么都不写，默认就是调用父类的无参构造器
    super();
  }

  ...
}
```

```java
public static void main(String[] args) {
  Sub sub = new Sub("Tom", 12);
}
```

### 5. `super` 在使用时，需要放在构造器第一行(super 只能在构造器中使用)

### 6. `super()` 和 `this()` 都只能放在构造器第一行，因此这两个方法不能共存在一个构造器

### 7. Java 所有类都是 Object 类的子类，Object 是所有类的基类

### 8. 父类构造器的调用不限于直接父类！将一直往上追溯直到Object类(顶级父类)

### 9. 子类最多只能继承一个父类(指直接继承)，即java中是单继承机制
思考：如何让A类继承B类和C类？
### 10. 不能滥用继承，子类和父类之间必须满足 `is a` 的逻辑关系

## super
> `super` 代表父类的引用，用于访问父类的属性、方法、构造器
### 基本语法
1. 访问父类的属性，但不能访问父类的private属性
```java
super.属性名
```
2. 访问父类的方法，但不能访问父类的private方法
```java
super.方法名(参数列表)
```
3. 访问父类的构造器
```java
super(参数列表) // 只能放在构造器的第一句，只能出现一句！
```

### super 的好处
1. 调用父类的构造器的好处(分工明确，父类属性由父类初始化，子类的属性由子类初始化)
2. 当子类中有和父粝中的成员(属性和方法)重名时，为了访问父类的成员，必须通过`super`.如果没有重名，使用`super、this`、直接访问是一样的效果！
3. super 的访问不限于直接父类，如果爷爷类和本类中有同名的成员，也可以使用`super`去访问爷爷类的成员；如果多个基类中都有同名的成员，使用`super`访问遵循就近原则。`A -> B - > C`
### this 与 super 的区别
|No |区别点     |this                                          |super|
|---------------|-------------------------------------------------|---|s
|1  |访问属性   |访问本类中的属性，如果本类没有此属性则从父类中继续查找|从父类开始查找属性|
|2  |调用方法   |访问本类中的属性，如果本类没有此属性则从父类中继续查找|从父类开始查找属性|
|3  |调用构造器 |调用本类构造器，必须放在构造器的首先|调用父类的构造器，必须放在子类构造器的首行|
|4  |   特殊    |表示当前对象|子类中访问父类对象|

## 重写
方法覆盖(重写)就是子类有一个方法，和父类的某个方法的名称、返回类型、参数一样，那么我们就说子类的这个方法覆盖了父类的那个方法

```java
public class Animal {
  public void cry() {
    System.out.println("动物叫");
  }
}

public class Dog extends Animal {
  /**
   * 因为Dog 是 Animal 子类
   * Dog 覆盖了 Animal 的 cry 方法
   */
  public void cry() {
    System.out.println("汪汪汪");
  }
}
```

### 重写注意事项
1. 子类的方法的参数，方法名称，要和父粝方法的参数，方法名称完全一样。
2. 子类方法的返回类型和父类方法返回类型一样，或者是父类返回类型的子类。比如 父类 返回的类型是Object, 子类方法返回类型是 String
```java
// 父类
public Object getInfo() {
  
}

// 子类
public String getInfo() {
  
}
```
3. 子类方法不能缩小父类方法的访问权限
```java
// public procted 默认 private
// 父类
public void sayOk() {
  
}

// 子类 报错
protected void sayOk() {
  
}

```
### 重写和重载的比较
|名称 |发生范围|方法名|参数列表|返回类型|修饰符|
|---- |-------|-----|---|---|
|重载(overload) |本类|必须一样|类型，个数或者顺序至少有一个不同|无要求|无要求|
|重写(override) |子父类|必须一样|相同|重写的方法返回的类型和父类返回的类型一致或者是其子类|子类方法不能缩小父类方法的访问范围|

## 重载
重载就是在一个