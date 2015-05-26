require 'benchmark'

def generate_email_list(num_emails)
  emails = []
  (1..num_emails/2).each do |n|
    emails << "user_#{n}@example.com"
  end
  (emails*2).shuffle
end

def uniquify(dup_array)
  unique_entries = Hash.new
  dup_array.each do |element|
    unique_entries[element] = 1 unless unique_entries[element]
  end
  unique_entries.keys
end

Benchmark.bmbm do |bm|
  emails = generate_email_list(1_000_000)

  bm.report("uniquify:") do
    unique_emails = uniquify(emails)
  end

  bm.report("uniq:") do
    unique_emails = emails.uniq
  end
end
