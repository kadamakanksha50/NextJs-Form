'use client'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import style from './Dashboard.module.css';
import toast, { Toaster } from 'react-hot-toast';

export default function page(){
    const router = useRouter()
    const [isCart, setCart]=useState(false)
    const [cartItems,setCartItems]=useState([])
    const [allItems,setAllItems]=useState([])
    const[cartStyle,setCartStyle]=useState({
        'bottom':'0px'
    })

    const [category,setCategory]=useState([
        {
            name:'Programming',
            class:'btn'
        },
        {
            name:'Databases',
            class:'btn'
        },
        {
            name:'Full Stack',
            class:'btn'
        },
        {
            name:'Data Structures',
            class:'btn'
        }
    ])

    const [courseData,setCourseData]=useState([])
    const logout=()=>{
        localStorage.removeItem('token')
        router.push('/')
    }
    const addCourse=()=>{
        router.push('/dashboard/add-course')
    }
    useEffect(()=>{
        setTimeout(()=>{
            getCourse()
        },1000)
    },[])
    useEffect(()=>{
        getAllItems()
    })

    const getItems = async ()=>{
        const res = await fetch('http://localhost:8000/api/getItems/'+localStorage.getItem('token'))
        const data = await res.json()
        setCartItems(data.message)
    }
    const getAllItems = async ()=>{
        const res = await fetch('http://localhost:8000/api/getAllItems/'+localStorage.getItem('token'))
        const data = await res.json()
        setAllItems(data.message)
    }
    const getCourse = async()=>{
        const res = await fetch('http://localhost:8000/api/getCourse')
        const data = await res.json()
        if(data.status){
            setCourseData(data.message)
        }
    }
    const getCourseWithCategory = async (category,index)=>{
        setCategory([
            {
                name:'Programming',
                class:'btn'
            },
            {
                name:'Databases',
                class:'btn'
            },
            {
                name:'Full Stack',
                class:'btn'
            },
            {
                name:'Data Structures',
                class:'btn'
            }
        ])
        setCategory((category)=>{
            const temp=[...category]
            temp[index].class='selected'
            return temp
        })
        const res = await fetch('http://localhost:8000/api/getCourse/'+category)
        const data = await res.json()
        if(data.status){
            setCourseData(data.message)
        }
    }
    const addToCart = async (coursetitle,mrp,banner)=>{
        const username = localStorage.getItem('token')
        const res = await fetch('http://localhost:8000/api/addToCart',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                username:username,
                coursetitle:coursetitle,
                mrp:mrp,
                banner:banner
            })
        })
        const data = await res.json()
        if(data.status){
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
    }
    const toggleCart=()=>{
        setCart(isCart=>!isCart)
        getItems()
    }

    return(
        <>
            <Toaster
                position='top-center'
                reverseOrder={false}
            />
            <div className={style.header}>
                <h2>NextJs App</h2>
                <div className={style.items}>
                    <button onClick={addCourse}>Add Course</button>
                    <div className={style.action}>
                        <button onClick={()=>toggleCart()}>Cart</button>
                        {
                            isCart && 
                            <>
                            <div className={style.cart}>
                                {
                                    cartItems.map((item,index)=>{
                                        return(
                                            <div className={style.card1}>
                                                <img src={'http://localhost:8000/uploads/'+item.Banner}></img>
                                                <h2 className={style.title}>{item.CourseTitle}</h2>
                                                <p>{'Rs. '+item.MRP.toFixed(2)}</p>
                                            </div>
                                        );
                                    })
                                }
                                {
                                    allItems.length > 3
                                    &&
                                    <div className={style.actionLink}>
                                        <a href='/dashboard/cart'>View all cart items</a>
                                    </div>
                                }
                            </div>
                        </>
                        }
                    </div>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>
            <div className={style.contain}>
                <div className={style.section}>
                    {
                        category.length > 0 && category.map((item,index)=>{
                            return(
                                <button className={item.class=='btn'?style.btn:style.selected} 
                                onClick={()=>getCourseWithCategory(item.name,index)}>{item.name}</button>
                            );
                        })
                    }
                </div>
                <div className={style.course}>
                    {
                        courseData.length > 0 ?(
                            courseData.map((item,index)=>{
                                return(
                                    <div className={style.card}>
                                        <img src={'http://localhost:8000/uploads/'+item.Banner}></img>
                                        <h2>{item.Title}</h2>
                                        <p className={style.desc}>{item.Description}</p>
                                        <div className={style.footer}>
                                            <p>{'Rs. '+item.MRP.toFixed(2)}</p>
                                            <p>{'Rs. '+item.Discount.toFixed(2)}</p>
                                            <button onClick={()=>addToCart(item.Title,item.Discount.toFixed(2),item.Banner)}>Add to Learn</button>
                                        </div>
                                    </div>
                                )
                            })
                        ):
                        (<h1 className={style.error}>Patience Loading... Please Wait for a minute</h1>)
                    }
                    
                </div>
            </div>
        </>
    );
}