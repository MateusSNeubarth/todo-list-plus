import { Button, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const { onLogin, onRegister } = useAuth();

    const login = async () => {
        const result = await onLogin!(email, password);
        if(result && result.error) {
            console.log(result.msg);
            alert(result.msg);
        }
    };

    const register = async () => {
        const result = await onRegister!(username, email, password);
        if(result && result.error) {
            alert(result.msg);
        } {
            login();
        }
    };

    return (
        <>
            {isLogin ? (
                <View style={styles.container}>
                    <View style={styles.form}>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Email" 
                            onChangeText={(text: string) => setEmail(text)} 
                            value={email}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Password" 
                            secureTextEntry={true} 
                            onChangeText={(text: string) => setPassword(text)}
                            value={password}
                        />
                        <Button onPress={login} title="Login" />
                    </View>
                    <Pressable 
                            onPress={() => setIsLogin(false)}
                            style={styles.pressable}    
                        >
                            <Text>Not registered? Register now!</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.container}>
                    <View style={styles.form}>
                        <TextInput 
                            style={styles.input}
                            placeholder="Username"
                            onChangeText={(text: string) => setUsername(text)}
                            value={username}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder="Email"
                            onChangeText={(text: string) => setEmail(text)}
                            value={email}
                        />
                        <TextInput 
                            style={styles.input}
                            placeholder="Password"
                            secureTextEntry={true} 
                            onChangeText={(text: string) => setPassword(text)}
                            value={password}
                        />
                        <Button onPress={register} title="Register" />
                    </View>
                    <Pressable 
                            onPress={() => setIsLogin(true)}
                            style={styles.pressable}    
                        >
                            <Text>Already have an account? Login here!</Text>
                    </Pressable>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    form: {
        gap: 10,
        width: '60%'
    },
    input: {
        height: 44,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    container: {
        alignItems: 'center',
        width: '100%'
    },
    pressable: {

    }
});

export default Login;