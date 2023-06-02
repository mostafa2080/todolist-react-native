import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./src/app/store";
import { home as Home } from "./components/home";
import todoDetails from "./components/todoDetails";

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "TODO APP" }}
          />
          <Stack.Screen name="todoDetails" component={todoDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
