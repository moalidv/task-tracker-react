import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./app.css";
import { useState } from "react";
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const queryClient = useQueryClient();

  async function getTasks() {
    const res = await fetch("http://localhost:5000/tasks");
    return res.json();
  }

  const tasksQuery = useQuery({ queryFn: getTasks, queryKey: ["tasks"] });

  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`);
    const data = await res.json();

    return data;
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    });
  };

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder };

    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    });
  };

  const toggleTaskMutation = useMutation({
    mutationFn: toggleReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const addTask = async (task) => {
    await fetch(`http://localhost:5000/tasks`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
  };

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    mutationKey: ["addTask"],
  });

  return (
    <Router>
      <div className="container">
        <Header
          onAdd={() => setShowAddTask(!showAddTask)}
          showAdd={showAddTask}
        />
        <Routes>
          <Route
            exact
            path="/"
            element={
              <>
                {showAddTask && (
                  <AddTask
                    loading={addTaskMutation.isPending}
                    onAdd={addTaskMutation.mutate}
                  />
                )}
                {tasksQuery.isLoading ? (
                  <p>getting tasks...</p>
                ) : tasksQuery.error ? (
                  <p>{tasksQuery.error.message} </p>
                ) : tasksQuery.data && tasksQuery.data.length > 0 ? (
                  <Tasks
                    tasks={tasksQuery.data}
                    deleteTask={deleteTaskMutation.mutate}
                    onToggle={toggleTaskMutation.mutate}
                  />
                ) : (
                  "no task to show"
                )}
              </>
            }
          />

          <Route path="/about" Component={About} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
