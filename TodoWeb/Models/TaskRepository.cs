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
        public IEnumerable<ToDoTask> Get()
        {

            ObjectCache cache = MemoryCache.Default;
            IEnumerable<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;

            return tasks;
        }

        public ToDoTask GetById(int id)
        {
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            ToDoTask task = tasks.Where(x => x.Id == id).FirstOrDefault();

            return task;
        }

        public void Add(ToDoTask newTask)
        {
            // get current list
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            tasks = tasks == null ? new List<ToDoTask>() : tasks;
            int? lastId = cache["lastId"] as int?;

            // add new task
            int newId = lastId == null ? 1 : (int)++lastId;
            newTask.Id = newId;
            tasks.Add(newTask);

            // persist
            cache["toDoTasks"] = tasks;
            cache["lastId"] = newId;
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

        public void Complete(int idToComplete)
        {

            // Get task
            ObjectCache cache = MemoryCache.Default;
            List<ToDoTask> tasks = cache["toDoTasks"] as List<ToDoTask>;
            ToDoTask task = tasks.Where(x => x.Id == idToComplete).FirstOrDefault();

            // update
            task.Status = ToDoStatus.Complete;

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