---
layout:     post
title:      "Coding Challenge: Removing Email Duplicates"
subtitle:   "A struggle between space and time."
date:       2015-05-23 19:00:00
author:     "Melanie VanderLugt"
header-img: "img/cooking.jpg"
tag:        projects
---

TL;DR: If you just want to see the solution to this coding challenge, the files are [available on my Github page](https://github.com/melanievee/melanievee.github.io/tree/master/_files/email_duplicates).

## The Challenge

I was recently asked to solve the following coding challenge:

Write a working function to remove all duplicates from an unsorted list of email addresses. Your resulting list should remain in the original order. Your function should be able to handle around 100,000 email addresses containing 50% randomly placed duplicates in well under 1 second on a typical modern laptop.

I was allowed to assume any input data structure I wanted (I chose to shove all the emails into an array). I was asked not to use any built-in library functions that make this problem trivial. (That means I can't use Ruby's Array#uniq function, darnit!)

## Build Some Tests

I generally use RSpec for my Rails Application testing. Lately, however, I've been trying to improve my MiniTest skills, so that's what I chose to use here.

I put together a really simple MiniTest suite with enough tests to make sure my code is working. First, I wanted to make sure I set up my email list correctly. I wrote tests to verify that my `generate_email_list` function generates a list that contains the number of emails I expected, and that half those emails are duplicates.

Because I'm essentially writing a function that does exactly the same thing Array#uniq does, it's really easy to write a quick test. I simply make sure that my `uniquify` function does the same thing with the email array that `Array#uniq` does.

My simple test suite:

{% highlight ruby linenos %}
require 'minitest/autorun'
require_relative 'email_sort'

class EmailsortTest < Minitest::Test
  def test_email_list_setup
    num_emails = 100_000
    list = generate_email_list(num_emails)
    assert_equal list.count/2, list.uniq.count
    assert_equal list.count, num_emails
  end

  def test_uniquify
    list = generate_email_list(100_000)
    assert_equal list.uniq, uniquify(list)
  end
end
{% endhighlight %}

## Generate All the Emails

Armed with my test suite, I'm ready to get to work. Let's build that email list.

It's trivial to build up an array of unique emails that is half my desired length using a simple loop. After I have that in hand, I multiplied the array by `2`. Array multiplication is interesting. Here's a quick example of what happens when you multiply an array by an integer:
{% highlight ruby %}
[A, B, C] * 2 = [A, B, C, A, B, C]
{% endhighlight %}

Finally, I use `shuffle` to make sure my array elements are in random order. In the end, I have an array on my hands that is made up of 50% duplicates, in random order.

Here's the full code to generate the email list, given a specific number of emails:

{% highlight ruby linenos %}
def generate_email_list(num_emails)
  emails = []
  (1..num_emails/2).each do |n|
    emails << "user_#{n}@example.com"
  end
  (emails*2).shuffle
end
{% endhighlight %}

## The Meat of the Problem: Removing Duplicates

There are multiple ways to solve this problem. I could iterate through each email in my array, then iterate again through the array looking for and eliminating duplicates, but that means I'll traverse my array N<sup>2</sup> times for an array of N elements. That's never good news.

Enter the Hash. Looking up an element in a Hash is just an O(1) operation; no time wasted traversing an array - the element is there or it's not. In the `uniquify` function below, we iterate through the list of emails, adding the unique ones to the Hash as keys as we go.

{% highlight ruby linenos %}
def uniquify(dup_array)
  unique_entries = Hash.new
  dup_array.each do |element|
    unique_entries[element] = 1 unless unique_entries[element]
  end
  unique_entries.keys
end
{% endhighlight %}

After we've traversed the original array of emails, we're left with the Hash of unique emails. Each unique email is a key inside this hash, so we can use the `Hash#keys` method to pull those out and return them from the function. (It's good to note that the `Hash#keys` method returns the keys in the order that they were added to the Hash, thus preserving the order of the original email list.)

## Benchmarking - How'd I do?

I wanted to make sure my solution processed 100,000 emails in well under 1 second, and I also wanted to see how I stood up to Ruby's built-in `Array#uniq` function, so I set up some benchmarking to measure my code:

{% highlight ruby linenos %}
Benchmark.bmbm do |bm|
  emails = generate_email_list(100_000)

  bm.report("uniquify:") do
    unique_emails = uniquify(emails)
  end

  bm.report("uniq:") do
    unique_emails = emails.uniq
  end
end
{% endhighlight %}

If you're not familiar with `Benchmark.bmbm`, it's handy because sometimes garbage collection can skew the results when you call just `Benchmark.bm`. With `bmbm`, the tests are run twice, once as a "rehearsal" and once "for real". Ruby's GC is forced to run after the rehearsal. The idea is that your results will be more accurate this way.

Here's the results from benchmarking this solution on my MacBook Air:

{% highlight ruby %}
Rehearsal ---------------------------------------------
uniquify:   0.090000   0.010000   0.100000 (  0.096580)
uniq:       0.060000   0.000000   0.060000 (  0.064417)
------------------------------------ total: 0.160000sec

                user     system      total        real
uniquify:   0.060000   0.000000   0.060000 (  0.064737)
uniq:       0.060000   0.000000   0.060000 (  0.062987)
{% endhighlight %}

Not bad! My `uniquify` function seems to be holding up against Ruby's built-in `Array#uniq` method.

## A Struggle Between Space and Time

For 1 million emails, this solution takes about 1 second to run:

{% highlight ruby %}
Rehearsal ---------------------------------------------
uniquify:   1.270000   0.050000   1.320000 (  1.351997)
uniq:       1.540000   0.030000   1.570000 (  1.605405)
------------------------------------ total: 2.890000sec

                user     system      total        real
uniquify:   1.050000   0.020000   1.070000 (  1.072724)
uniq:       1.130000   0.020000   1.150000 (  1.156912)
{% endhighlight %}

Once we get up to about 10 million emails in our array, it takes about 32 seconds to remove duplicates, but the Ruby process on my machine starts eating up memory.

Benchmarking for 10 Million emails:
{% highlight ruby %}
Rehearsal ---------------------------------------------
uniquify:  31.010000   1.610000  32.620000 ( 34.354450)
uniq:      38.600000   0.930000  39.530000 ( 40.525922)
----------------------------------- total: 72.150000sec

                user     system      total        real
uniquify:  30.800000   0.390000  31.190000 ( 31.790559)
uniq:      36.070000   0.460000  36.530000 ( 37.216896)
{% endhighlight %}

For 10 million emails, the Ruby process maxes out at about 1.3 GB of memory. I only have 4 GB of memory on my machine, so processing a billion emails using my uniquify function is not going to be good news.

For anything over 10 million emails, I'd consider eliminating the hash altogether. It might even be a good idea to try moving back to the N<sup>2</sup> solution, where we would iterate through the array one email at a time, then iterate over the remaining elements in the array to remove duplicates. This solution would unquestionably take <strong>much</strong> longer than the Hash method, but we'd be storing a lot less data in memory.

If I could just get my hands on a computer with a huge amount of Memory, life would sure be easy wouldn't it?
