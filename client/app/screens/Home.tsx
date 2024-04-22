import { Keyboard, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from "axios";
import Task from "../components/Task";

interface Todo {
    _id: string;
    todoText: string;
    user_id: string
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const Home = () => {
    const [todo, setTodo] = useState<string>();
    const [todoList, setTodoList] = useState<Todo[]>([]);
    
    const setTodos = async () => {
        try{
            const USER_ID = await SecureStore.getItemAsync('USER_ID');
            const url = 'http://10.0.2.2:8080/api/todo/' + USER_ID?.replaceAll('"', '');
            const response = await axios.get(url);
            setTodoList(response.data);
        } catch(err) {
            console.log("Error found ~ " + err);
        }
    };

    useEffect(() => {
        setTodos();
    }, []);

    const handleAddTask = async () => {
        Keyboard.dismiss();
        try {
            const USER_ID = await SecureStore.getItemAsync('USER_ID');
            const url = 'http://10.0.2.2:8080/api/todo/' + USER_ID?.replaceAll('"', '');
            const response = await axios.post(url, { todoText: todo });
            setTodoList([...todoList, response.data])
        } catch (err) {
            console.log("Error found ~ " + err);
        }
    };

    const completeTask = async (task_id: string) => {
        try {
            const url = 'http://10.0.2.2:8080/api/todo/' + task_id;
            await axios.delete(url);
            setTodos();
        } catch (err) {
            console.log("Error found ~ "+ err);
        }
    };

    return (
        <View style={styles.container}>

      {/* Today's Tasks */}
      <View style={styles.taskWrapper}>
        <Text style={styles.sectionTitle}>Your tasks</Text>

        <View style={styles.items}>
          {/* This is where the tasks will go */}
          {
            todoList.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() =>completeTask(item._id)}>
                  <Task text={item.todoText} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>

      {/* Write a task */}
      <KeyboardAvoidingView
        //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.writeTaskWrapper}
      >
        <TextInput 
          style={styles.input} 
          placeholder={'Write a task'}
          value={todo}
          onChangeText={text => setTodo(text)} 
        />

        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>

    </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#E8EAED',
    },
    taskWrapper: {
      paddingTop: 80,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold'
    },
    items: {
      marginTop: 30,
    },
    writeTaskWrapper: {
      position: 'absolute',
      bottom: 60,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    input: {
      paddingVertical: 15,
      paddingHorizontal: 15,
      backgroundColor: '#FFF',
      borderRadius: 60,
      borderColor: '#C0C0C0',
      borderWidth: 1,
      width: 250,
    },
    addWrapper: {
      width: 60,
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 60,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: '#C0C0C0',
      borderWidth: 1,
    },
    addText: {}
  });
  

export default Home;