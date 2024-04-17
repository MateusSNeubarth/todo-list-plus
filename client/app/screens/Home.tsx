import { Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";

interface Todo {
    _id: string;
    todoText: string;
    user_id: string
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const Home = () => {
    const [todoList, setTodoList] = useState<Todo[]>([]);
    

    useEffect(() => {
        const setTodos = async () => {
            try{
                const USER_ID = await SecureStore.getItemAsync('USER_ID');
                const url = 'http://10.0.2.2:8080/api/todo/' + USER_ID?.replaceAll('"', '')
                const response = await axios.get(url);
                setTodoList(response.data);
            } catch(err) {
                console.log("Error found ~ " + err);
            }
        };
        setTodos();
    },[]);

    return (
        <View>
            {todoList.map((todo: Todo, key) => {
                return <Text key={key}>{todo.todoText}</Text>
            })}
        </View>
    );
};

export default Home;