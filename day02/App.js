import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.log('Error loading todos:', error);
    }
  };

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
      console.log('Error saving todos:', error);
    }
  };

  const Item = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('TodoDetails', { todo: item })}
      onLongPress={() => {
        setModalVisible(true);
        setSelectedTodo(item);
      }}
    >
      <Text
        style={[
          styles.title,
          item.status === 'done' && styles.doneTitle,
        ]}
      >
        {item.title}
      </Text>
      <Text
        style={[
          styles.description,
          item.status === 'done' && styles.doneTitle,
        ]}
      >
        {item.description}
      </Text>
      <TouchableOpacity
        style={styles.statusButton}
        onPress={() => toggleStatus(item.id)}
      >
        <Text style={styles.statusButtonText}>
          {item.status === 'active' ? 'Mark Done' : 'Mark Active'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const addTodo = () => {
    setCount((prevCount) => prevCount + 1);
    setTodos([
      ...todos,
      { id: count, title, description, status: 'active' },
    ]);
    setTitle('');
    setDescription('');
  };

  const toggleStatus = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === 'active' ? 'done' : 'active',
            }
          : todo
      )
    );
  };

  const filterTodos = (todoList) => {
    if (filter === 'active') {
      return todoList.filter((todo) => todo.status === 'active');
    } else if (filter === 'done') {
      return todoList.filter((todo) => todo.status === 'done');
    } else {
      return todoList;
    }
  };

  const deleteTodo = () => {
    setTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== selectedTodo.id)
    );
    setModalVisible(false);
  };

  const renderItem = ({ item }) => <Item item={item} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'all' && styles.filterButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'active' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('active')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'active' && styles.filterButtonTextActive,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'done' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('done')}
        >
          <Text
            style={[
              styles.filterButtonText,
              filter === 'done' && styles.filterButtonTextActive,
            ]}
          >
            Done
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filterTodos(todos)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this todo?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableHighlight
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={deleteTodo}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add Todo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const TodoDetailsScreen = ({ route }) => {
  const { todo } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{todo.title}</Text>
      <Text style={styles.description}>{todo.description}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TodoDetails" component={TodoDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterButtonActive: {
    backgroundColor: '#333',
  },
  filterButtonText: {
    color: '#333',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  item: {
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    padding: 16,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  doneTitle: {
    textDecorationLine: 'line-through',
  },
  statusButton: {
    marginTop: 8,
    backgroundColor: '#333',
    padding: 6,
    borderRadius: 4,
  },
  statusButtonText: {
    color: '#fff',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#333',
    paddingVertical: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 4,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 4,
  },
  modalButtonCancel: {
    backgroundColor: '#ccc',
  },
  modalButtonDelete: {
    backgroundColor: '#f00',
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default App;
