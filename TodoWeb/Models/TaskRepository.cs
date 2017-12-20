using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Web;

namespace TodoWeb.Models
{
    public class TaskRepository : ITaskRepository
    {
        // New Task
        //      Get Task Details
        //      Update Task Details
        //      Complete Task(set status to complete)
        //      Delete Task
        public IEnumerable<ToDoTask> Get(bool includeCompleted)
        {
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            if (tasks != null)
            {
                if (includeCompleted)
                {
                    return tasks;
                }
                else
                {
                    IEnumerable<ToDoTask> incompleteTasks = tasks.Where(x => x.Status == ToDoStatus.InComplete);

                    return incompleteTasks;
                }
            }
            else
            {
                return tasks;
            }
        }
        
        public ToDoTask Add(ToDoTask newTask)
        {
            // get current list
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            tasks = tasks == null ? new List<ToDoTask>() : tasks;
            int? lastId = cache["lastId"] as int?;

            // add new task
            int newId = lastId == null ? 1 : (int)++lastId;
            newTask.Id = newId;
            newTask.Status = ToDoStatus.InComplete;
            tasks.Add(newTask);

            // persist
            cache["toDoTasks"] = tasks;
            cache["lastId"] = newId;

            return newTask;
        }

        public void Update(ToDoTask modifiedTask)
        {
            // Get task
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            ToDoTask task = tasks.Where(x => x.Id == modifiedTask.Id).FirstOrDefault();

            // update
            task.Name = modifiedTask.Name;
            task.Description = modifiedTask.Description;

            // persist
            cache["toDoTasks"] = tasks;
        }

        public void ChangeStatus(ToDoTask modifiedTask)
        {

            // Get task
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            ToDoTask task = tasks.Where(x => x.Id == modifiedTask.Id).FirstOrDefault();

            // update
            task.Status = modifiedTask.Status;

            // persist
            cache["toDoTasks"] = tasks;
        }

        public void Delete(int idForDeletion)
        {
            // Get task
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            ToDoTask task = tasks.Where(x => x.Id == idForDeletion).FirstOrDefault();

            // update
            tasks.Remove(task);

            // persist
            cache["toDoTasks"] = tasks;
        }
    }
}