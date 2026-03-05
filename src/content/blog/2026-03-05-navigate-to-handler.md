---
title: "The navigation shortcut Visual Studio forgot to ship"
date: 2026-03-05
draft: false
description: "Navigate to Handler is a free Visual Studio 2022 extension that finds every method in your solution that consumes a given type. Perfect for MediatR, custom mediators, event buses, and more."
excerpt: "F12 shows you where a type is defined. It won't show you where it's consumed. I built a Visual Studio 2022 extension that does."
readTime: "3 minute read"
categories: ["Development"]
tags: ["dotnet", "visual-studio-extension", "mediatr", "productivity", "csharp", "cqrs"]
author: "Pedro Dias"
featuredImage: "/images/blog/2026-03-05-navigate-to-handler/featured.jpg"
featuredAlt: "Visual Studio 2022 context menu showing Navigate to Handler highlighted, with the keyboard shortcut Ctrl+Alt+H"
imageCredit: "© Pedro Dias"
---

You're debugging a slow API endpoint. You find the controller action, see it dispatches a `GetOrderSummaryQuery`, and press **F12** to navigate to the handler.

Visual Studio takes you to the `IRequest<T>` interface definition in the MediatR package.

Thanks, very helpful.

You close that, open the Solution Explorer, type "GetOrderSummary" in the search box, and eventually land on `GetOrderSummaryQueryHandler`, buried three folders deep in a different project.

If you've used MediatR in a real codebase, you've done this dance hundreds of times. But the same problem exists anywhere types flow through a message bus, event dispatcher, or DI container at runtime.

---

## Why F12 fails you here

F12 ("Go to Definition") follows the type system. When you press it on `new GetOrderSummaryQuery()`, Visual Studio sees a class and jumps to where that class is defined. Perfectly logical. Completely useless for your actual goal.

The problem isn't MediatR — it's any pattern where the connection between a type and its consumer is wired up at runtime rather than in code. The Mediator pattern, domain events, custom command buses: none of them create a compile-time reference from the type to the class that handles it. Your controller dispatches a message. Something, somewhere, picks it up. F12 has no way to follow that.

So you search. Every time. Forever.

---

## The extension: Navigate to Handler

**[Navigate to Handler](https://marketplace.visualstudio.com/items?itemName=digitaldias-pedro-g-dias.n2hv1)** is a free Visual Studio 2022 extension that answers a different question than F12: not "where is this type defined?" but "where is this type consumed?"

Place your cursor on any non-built-in type and select **Navigate to Handler** from the context menu (or press **Ctrl+Alt+H**). The extension scans every project in your solution and returns every public or protected method that accepts that type as a parameter.

That's it. You're there.

No searching. No guessing which project the handler lives in. No reading folder names hoping one of them gives you a clue.

---

## What it looks like in practice

Say you have this in your controller:

```csharp
var result = await _mediator.Send(new CreateInvoiceCommand(order.Id, customerId));
```

You place your cursor on `CreateInvoiceCommand` and choose **Navigate to Handler**. Visual Studio opens:

```csharp
public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, InvoiceDto>
{
    public async Task<InvoiceDto> Handle(CreateInvoiceCommand request, CancellationToken cancellationToken)
    {
        // the actual work happens here
    }
}
```

If there's only one consumer, you jump straight to it. If there are multiple — a MediatR pipeline behavior, a second handler, an event subscriber in a different module — you get a list to pick from.

It works the same way for domain events, custom command dispatchers, or any other type your codebase passes around at runtime. If a method somewhere accepts it as a parameter, Navigate to Handler finds it.

Want to see it in action? [Watch the short demo on YouTube](https://www.youtube.com/watch?v=THvwOrCXdwc).

---

## Why this matters more in large solutions

In a small project with a handful of handlers, you can remember where things live. You built it last week.

In a large solution with 50+ projects, 200+ commands and queries spread across domain modules, the mental map breaks down fast. New team members spend their first weeks learning *where things are*. Even experienced developers on the team stop trusting their memory and reach for search.

Every unnecessary context switch has a cost. You lose your train of thought. You forget what you were looking for in the first place. The debugging session should take 10 minutes; it stretches to 30.

**Navigate to Handler** is a small fix for a small problem. But it's a problem that happens constantly, and removing friction from constant problems adds up.

---

## Why I built it

I got tired of searching.

That's really it. I kept seeing the same pattern: developer presses F12 on a request type, ends up somewhere useless, sighs, opens search. I did it myself dozens of times a day — in MediatR codebases, in projects with custom event buses, in legacy systems with hand-rolled command dispatchers.

It seemed like the kind of problem already solved. When I looked, it wasn't, at least not in a form that felt natural inside Visual Studio's existing navigation model.

So I built it, published it, and use it every day.

---

## Common questions

**Does it work with Visual Studio 2019?**
No. It targets Visual Studio 2022. There are no plans to backport it.

**What about JetBrains Rider?**
Not yet. Rider has its own extension model, which would be a separate project.

**What if multiple consumers are found?**
You get a pick list in a tool window rather than a direct jump. Each result shows the class name, method name, and source file so you can choose the right one.

**Does it only work with MediatR?**
No. The extension has no MediatR-specific logic. It works on any non-built-in type: place your cursor on a class or interface, and it finds every public or protected method in your solution that accepts that type as a parameter. Roll your own mediator, event bus, command dispatcher — it finds the consumers.

---

## Get it

**Navigate to Handler** is available in the Visual Studio Marketplace.

- [Install from the VS Marketplace](https://marketplace.visualstudio.com/items?itemName=digitaldias-pedro-g-dias.n2hv1), or search for *"Navigate to Handler"* in **Extensions → Manage Extensions**
- [Source on GitHub](https://github.com/digitaldias/NavigateToHandler). Open issues, submit PRs, see what's planned.
- [Watch the demo on YouTube](https://www.youtube.com/watch?v=THvwOrCXdwc). Two minutes to see exactly what it does.

If it saves you time, let me know; always good to hear it's useful for someone else too.

---

*Pedro Dias is Chief AI Officer at Tradesolution AS and writes about .NET, architecture, and the tools that make development less painful. More at [digitaldias.com](https://digitaldias.com).*
