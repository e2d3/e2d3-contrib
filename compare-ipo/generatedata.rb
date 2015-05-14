#!/usr/bin/env ruby
# -*- coding: utf-8 -*-

require 'faker'

def time_rand from = 0.0, to = Time.now
  Time.at(from + rand * (to.to_f - from.to_f))
end

CATEGORIES = ["Social Game", "System Integrator", "Web Service", "Consumer Game"]

File.open("data.tsv", "w") do |out|
  out.puts "date	name\tcategory\tIPO	First day change\tThree years later\tLatest"
  for name in 0..200
    date = time_rand(Time.local(1980, 1, 1)).strftime "%Y-%m-%d"
    name = Faker::Company.name + ", Inc."
    category = CATEGORIES.sample
    ipo = 10 ** (9 + rand * 4)

    if ipo > 10e11
      first = ipo * (1.0 + (rand - 0.5) * 0.6)
      three = ipo * (1.0 + (rand - 0.3) * 0.2)
      latest = ipo * (1.0 + (rand - 0.8) * 1.0)
    else
      first = ipo * (1.0 + (rand - 0.5) * 0.6)
      three = ipo * (1.0 + (rand - 0.3) * 1.0)
      latest = ipo * (1.0 + (rand - 0.2) * 5.0)
    end

    out.puts "#{date}\t#{name}\t#{category}\t#{ipo.floor}\t#{first.floor}\t#{three.floor}\t#{latest.floor}"
  end
end
