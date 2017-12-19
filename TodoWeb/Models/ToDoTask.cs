using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TodoWeb.Models
{
    public class ToDoTask
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ToDoStatus Status { get; set; }
    }

    public enum ToDoStatus
    {
        InComplete,
        Complete
    }
}