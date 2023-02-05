
## sync包

### Mutex互斥锁

Lock()、Unlock()

:::::: details 查看代码
```go
func main() {
	lock := &sync.Mutex{}
	go LockFunc(lock)
	go LockFunc(lock)
  for{}
}

func LockFunc(lock *sync.Mutex){
	lock.Lock()
	fmt.Println("11")
	time.Sleep((1*time.Second))
	lock.Unlock()
}
```
:::
### RWMutex读写互斥锁
Lock()、Unlock()、Rlock()、RUnlock()

- Lock写的时候排斥其他的写锁和读锁
- RLock在读取的时候不会阻塞其他的读锁但是会排斥掉写锁
::: details 查看代码
```go
func main() {
	lock := &sync.Mutex{}
	read_lock := &sync.RWMutex{}
	go LockFunc(lock)
	go LockFunc(lock)
	go ReadLockFunc(read_lock)
	go ReadLockFunc(read_lock)
	go ReadLockFunc(read_lock)
	go ReadLockFunc(read_lock)
	for{}
}

func LockFunc(lock *sync.Mutex){
	// 写的时候排斥其他的写锁和读锁
	lock.Lock()
	fmt.Println("11")
	time.Sleep((1*time.Second))
	lock.Unlock()
}
func ReadLockFunc(r_lock *sync.RWMutex){
	// 在读取的时候不会阻塞其他的读锁但是会排斥掉写锁
	r_lock.RLock()
	fmt.Println("read-11")
	time.Sleep((1*time.Second))
	r_lock.RUnlock()
}
```
:::
### Once

Once.Do(一个函数)这个方法无论被调用多少次这里只会执行一次

::: details 查看代码
```go
func Once(){
	once := &sync.Once{}
	for i:=1; i<5; i++ {
		once.Do(func() {
			fmt.Println(i)
		})
	}
	for i:=0; i<5; i++ {
		once.Do(func() {
			fmt.Println(i)
		})
	}
}
```
:::

### WaitGroup
Add(delta int)设定需要Done多少次
Done() Done 1次+1
Wait() 再到达Done的次数前一直阻塞

::: details 查看代码
```go
func WaitG (){
	w := &sync.WaitGroup{}
	w.Add(2)
	go func(){
		time.Sleep(8*time.Second)
		w.Done()
		fmt.Println("delta-1")
	}()
	go func(){
		time.Sleep(6*time.Second)
		w.Done()
		fmt.Println("delta-1")
	}()
	w.Wait()
	time.Sleep(4*time.Second)
}
```
:::

### Map一个并发字典
Store、Load、LoadOrStore、Range、Delete


::: details 查看代码
```go
func SyMap(){
	m := &sync.Map{}
	go func(){
		for{
			m.Store(4, 0)
		}
	}()
	go func(){
		for{
			fmt.Println(m.Load(4))
		}
	}()
	time.Sleep(100)
	m.Store(1,2)
	m.LoadOrStore(3,3)
	m.Delete(1)
	fmt.Println(m.LoadOrStore(3,3))
	m.Range(func(k, v interface{}) bool {
		fmt.Println(k,"==>",v)
		time.Sleep(100)
		return true
	})
}
```
:::
### Pool并发池
Put、Get

::: details 查看代码
```go
func Pool(){
	p := &sync.Pool{}
	p.Put(1)
	p.Put(2)
	p.Put(3)
	p.Put(4)
	p.Put(5)
	p.Put(6)
	for i:=0; i<8; i++{
		time.Sleep(1 *time.Second)
		fmt.Println(p.Get())
	}
}
```
:::

### Cond没多大用的通知解锁

NewCond(lock)创建一个cond
co.L.Lock()、co.L.Unlock()，创建一个锁区间在区域内部可co.wait()
co.roadcast()解锁全部
co.Signal()解锁一个

::: details 查看代码
```go
func Cond(){
	co := sync.NewCond(&sync.Mutex{})
	// co.L.Lock()
	// co.Wait()
	// co.Wait()
	// co.Wait()
	// co.L.Unlock()
	// co.Signal()
	// co.Broadcast()

	go func(){
		co.L.Lock()
		fmt.Println("Lock1")
		co.Wait()
		fmt.Println("unlock1")
		co.L.Unlock()
	}()
	go func(){
		co.L.Lock()
		fmt.Println("Lock2")
		co.Wait()
		fmt.Println("unlock2")
		co.L.Unlock()
	}()
	time.Sleep(2*time.Second)
	// co.Broadcast()
	co.Signal()
	time.Sleep(1*time.Second)
}
```
:::