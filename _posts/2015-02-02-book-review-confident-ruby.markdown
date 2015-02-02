---
layout:     post
title:      "Book Review: Confident Ruby"
subtitle:   "Every Rubyist should have this book on their reference shelf."
date:       2015-02-02 12:00:00
author:     "Melanie VanderLugt"
header-img: "img/cat.jpg"
tag:				book-review
---

I love the idea that a tech talk can evolve into a full fledged book, which is exactly how Avdi Grimm's book, Confident Ruby, came about. According to the preface, Avdi gave his first tech talk, called "Confident Code", to a room full of Rubyists in Baltimore in 2010. He goes on to say that his Confident Code talk receives the most positive feedback of any of his talks, and I think that's for very good reason. The ideas that are laid out in this book are awesome.

Before reading Confident Ruby, I hadn't thought about categorizing code as timid or confident. We've all probably accused code of being poorly organized, convoluted, maybe even overly clever, but I previously only thought of timidity and confidence as people-oriented traits. It's eye opening to think of code as being timid or confident. Is my code shy? Am I checking for nil all over the place? Is my code confidently laying out the story I want to tell? These are all questions Avdi's book can help you answer about your own code. (The coding patterns in Confident Ruby can help you fix timidity, too!)

Confident Ruby (published in 2013), is a must-read for any Ruby newbie. In fact, I enjoyed reading it so much that it might just join my read-again-every-year book list. It definitely earned itself a permanent home on my Kindle.

##The 3 Concepts from Confident Ruby That I Liked the Most

### #1: Your Code Should Tell a Story

Choose your own adventure books were a fun part of childhood, but there's no place for them in code today. Trying to read spaghetti code is a little like trying to read a choose-your-own-adventure book from cover to cover. It's confusing, there are too many things to keep track of, and you seem to jump backwards and forwards in time. There is no compelling narrative and a clear story doesn't emerge.

According to Confident Ruby, your code should have a compelling narrative; it should tell a clear story. In order to tell that story confidently and clearly, the book suggests organizing methods into Four Parts, in this order:

* Collecting Input 
* Performing Work
* Delivering Output
* Handling Failures

Following this rule of thumb helps organize code into clearly defined chunks with clearly defined purposes. It leaves failure handling until the end of the method so it doesn't distract from the method's main purpose. I recommend checking out the companion video that comes with Confident Ruby to watch Avdi put this theory to work in some real-life out-there-in-the-wild code.


### #2: Use Fetch instead of nil checking

One pattern presented in Confident Ruby that I'll immediately start utilizing in my projects is the use of #fetch to assert the presence of Hash keys. If you have a method that takes a hash as input, and some of your hash elements are non-optional, this is a great pattern to latch onto. Strip unnecessary "if" statements out of your method that test for the presence of the keys and instead call fetch.

Instead of:

{% highlight ruby linenos %}
def my_first_method(myhash)
  required_input = myhash[:required_input]
  unless required_input
    raise ArgumentError, 'required input was not supplied!'
  end
end
{% endhighlight %}

You can simply use this:
{% highlight ruby linenos %}
def my_better_method(myhash)
  required_input = myhash.fetch(:required_input)
end
{% endhighlight %}

Clear. Concise. Fabulous. It's important to understand that the #fetch method is checking for the presence of the KEY; it has nothing to do with the actual value stored with that key. In the first method, it's possible that if our required_input key holds the value "false", we could erroneously raise an exception claiming that we weren't provided with the right inputs. In the second method, if the value for the required_input key is FALSE, it's still considered an acceptable input. As Avdi so eloquently puts it, by using #fetch, we are "differentiating between missing keys and falsey values".

But what is the coolest thing about using the #fetch method? You can send in a block that will be evaluated when the key you're attempting to fetch is missing! Using this feature, it's possible to add more descriptive messages to your exceptions, or raise different types of exceptions altogether.

{% highlight ruby linenos %}
def my_better_method(myhash)
  required_input = myhash.fetch(:required_input) do 
    raise KeyError, "The required_input was not supplied!"
  end
end
{% endhighlight %}

Awesome!

### #3: Take advantage of Ruby's Built-in Conversion Functions

Most Ruby Devs are familiar with conversion methods like #to_i and #to_a. Until I read Confident Ruby, I wasn't aware that Ruby has a different set of capitalized conversion functions: Integer(), Array(), Float(), String(), Rational(), and Complex().

In the book, Avdi explains that these capitalized conversion functions are great for converting inputs into your desired data type, but here's the kicker - it only successfully converts values when there is a sensible way of doing it. As an example, you could look at this case:

{% highlight bash linenos %}
2.1.2 :001 > "this is definitely a string, not a number".to_i
 => 0 
2.1.2 :002 > Integer("this is definitely a string, not a number")
ArgumentError: invalid value for Integer(): "this is definitely a string, not a number"
{% endhighlight %}

Using #to_i converts our string into zero. That doesn't make a whole lot of sense to me, and I wouldn't want to do that without knowing exactly why I'm doign it.

In most cases, it just doesn't make sense to convert a string into an integer. If you use #to_i instead of the more strict Integer conversion function, you could inadvertently be letting nonsensical values into your application. It can be a good idea to just alert the user with an Error when your program receives something it doesn't make sense to convert.

### The Verdict: A Must Read
If you're a Rubyist and haven't had a look at this book yet, I highly recommend giving it a read. It's quick to get through, easy to absorb, and definitely deserves a spot on your shelf of code references. Plus, it contains emergency kittens. Perfect for times when those coding examples become a little bit too intense and you just need a chuckle.