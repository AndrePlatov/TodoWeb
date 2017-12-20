using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TodoWeb.Models
{
    public interface ITaskRepository
    {
        IEnumerable<ToDoTask> Get(bool includeCompleted);
        ToDoTask Add(ToDoTask newTask);
        void Update(ToDoTask modifiedTask);
        void ChangeStatus(ToDoTask modifiedTask);
        void Delete(int idForDeletion);
    }
}