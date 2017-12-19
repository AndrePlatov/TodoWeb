using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TodoWeb.Models
{
    public interface ITaskRepository
    {
        IEnumerable<ToDoTask> Get();
        void Add(ToDoTask newTask);
        ToDoTask GetById(int id);
        void Update(ToDoTask modifiedTask);
        void Complete(int idToComplete);
        void Delete(int idForDeletion);
    }
}