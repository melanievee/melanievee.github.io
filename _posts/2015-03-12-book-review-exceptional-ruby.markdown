---
layout:     post
title:      "Book Review: Exceptional Ruby"
subtitle:   "Another good book by Avdi Grimm."
date:       2015-03-12 14:45:00
author:     "Melanie VanderLugt"
header-img: "img/tower-of-pisa.jpeg"
tag:        book-review
---

Exceptional Ruby (published in 2011) was my second Avdi Grimm book in the last couple of months. This book is a great way to dip your toes into the exception handling pond without getting scared away. I'm a sucker for books that start off with a coding metaphor, and Avdi didn't disappoint. In the intro, he compares exception handling to the toys and clothes a kid stuffs in his closet right before Mom comes to inspect his room. Like a kid cleaning his room, a lot of programmers leave exception handling until last minute, more of an "oh crap!" afterthought than an important well-planned piece of your program. 

Failure handling is the underdog that finally gets its time to shine in Exceptional Ruby. Avdi provides example after example of great ways to raise and handle exceptions, many of which I never would've thought up on my own out of the blue. If you read this book and don't feel exceptionally enlightened (pun totally intended), you must be an exceptional genius already. (Is it bad form to use the same pun twice in one sentence?)


##A Few Quick Tidbits I Never Want to Forget

I'll let you in on a secret. I mostly write book reviews for my own personal benefit. Sometimes there's just not enough space in my head to store the info I want to keep in there. Blog posts are an extension of my brain that I can come back and find again later. In Exceptional Ruby, Avdi touched on a few things I know I'll want to remember:

1. In Ruby, `raise` and `fail` are synonyms. Neither is a Ruby keyword. Rather, they're Kernel methods, so they **can** be overriden!
2. The currently active exception is always stored in the global variable `$!`. If there is no active exception, `$!` will be nil.
3. The `begin` keyword is considered by some to be a code smell in Ruby. Instead of peppering your code with lots of `begin`, `rescue`, and `end` blocks, take advantage of Ruby's implicit begin blocks:
        
        def foo
          # main logic
        rescue 
          # handle failures here. No explicit begin or end necessary, hooray!
        end

4. A bare `rescue` will catch only `StandardError` and any derived classes. It will not catch these puppies:
  * `NoMemoryError`
  * `LoadError`
  * `NotImplementedError`
  * `SignalException`
  * `Interrupt`
  * `ScriptError`

##Exceptional Ideas from Exceptional Ruby

###Nested Exceptions
In Ruby, it's possible to raise a new exception while we're in the process of handling a previously incurred exception. When this occurs, the original exception is thrown away, completely gone, *unless* you utilize the idea of Nested Exceptions that Avdi introduces in his book.

Nested Exceptions hold a reference to the original exception so that it isn't thrown away. Here's how you'd do it: 

{% highlight ruby linenos %}
class MyError < StandardError
  attr_reader :original
  def initialize(msg, original=$!)
    super(msg)
    @original = original; 
  end
end

begin 
  begin
    raise "Error A" 
  rescue => error
    raise MyError, "Error B" 
  end
rescue => error
  puts "Current failure: #{error.inspect}"
  puts "Original failure: #{error.original.inspect}"
end
{% endhighlight %}

Running this code produces the output:

    Current failure: #<MyError: Error B>
    Original failure: #<RuntimeError: Error A>

What's happening here? We created our own error class called `MyError` that stores any currently active exception in `original` and sends `msg` up to its parent `StandardError` object via the call to `super`. As we'd expect, our current failure is set to Error B (our most recent failure), which is of type `MyError`. The key thing to note in this example is that we still have access to Error A *through* Error B by calling `error.original`. (Note that Error A is a `RuntimeError` because this is the default exception type when you use just a bare `raise`.)

###Code Bulkheads
Nobody wants their code to sink like the Titanic. In ship-speak, bulkheads are placed between ship compartments so that a leak in one compartment will not spread to others. This enables a ship to stay afloat even if one of its compartments is completely flooded. The Titanic had inadequate bulkheads, whith turned out to be a devastating design flaw.

Exceptional Ruby discusses the concept of erecting Bulkheads in your code to stop cascading failures. This isolates parts of your codes from others so that a failure in one area doesn't cause other parts of the ship to go down. 

It's a good idea to place bulkheads between your app and External Services and External processes. One easy way *Exceptional Ruby* shows us how to do this is to rescue exceptions and write them to a log instead of bringing down the program:

{% highlight ruby linenos %}
begin
  # External Web Request
  response = HTTParty.get("http://www.reddit.com/r/pics")
  # Everyone loves a good HTTParty
rescue Exception => error
  logger.error "External Web Request encountered an Exception."
  logger.error error.message
  logger.error error.backtrace.join("\n")
end
{% endhighlight %}

###Circuit Breakers
Another way to handle failures is using the Circuit Breaker pattern, which Avdi references from Michael Nygard's book <em>Release It!</em> Circuit breakers are essentially a way of counting failures in particular areas of your App. 

When a threshold is met for one component of your program, a "circuit breaker" opens and that component isn't permitted to operate. After a period of time, the circuit breaker enters a half-open state, where one failure can cause it to open again. Normal operation is the "closed" state. Check out Will Sargent's <a href="https://github.com/wsargent/circuit_breaker">Ruby Implementation</a>  of this pattern on Github.


###Allow for User-injected Failure Policies
I *love* this exceptional method of handling exceptions. (There's that pesky pun again...) It's as simple as this - defer to the method caller!

Avdi refers to this as "caller-supplied fallback strategy". In my <a href="{{ site.url }}/2015/02/02/book-review-confident-ruby/">previous book review about Confident Ruby</a>, I raved about using the Hash fetch method to assert the presence of hash keys. 

In *Exceptional Ruby*, I learned that you can pass a block to the fetch method that tells it how to respond to failures! This gives the caller the power to dictate the policy for missing keys, instead of having a policy foisted upon them.
{% highlight ruby linenos %}
h.fetch(:required_key) {
  raise "ZOMG that required key doesn't exist!" 
}
{% endhighlight %}

You can write your own methods so that you let callers determine what to do if something goes awry. Here's a super simple example to show you how a method can be structured if you want users to provide their own way of handling unexpected behavior:
{% highlight ruby linenos %}
def render_book_details(book)
  if book.title && book.author
    "#{book.title} by #{book.author}"
  else
    yield
  end
end
{% endhighlight %}

Here, I've assumed you have a book object with title and author attributes. If an instance of book doesn't have either of these attributes, we have a problem. The caller needs to provide a way of handling this problem in the form of a code block. There are a couple ways the caller might handle this.

Perhaps you want the `render_book_details` method to return a default string if the book title and author aren't present:
{% highlight ruby %}
print_book_details(mybook){ "Book title or author not found." }
{% endhighlight %}

You could also raise an exception instead of returning a default string. That's easy too!
{% highlight ruby %}  
print_book_details(mybook){ raise "Book is missing title or author." }
{% endhighlight %}

The user can provide any number of code blocks to handle errors in this situation. What's truly important is that the power lies with the caller, not with the method author.