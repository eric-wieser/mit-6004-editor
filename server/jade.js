var jade_defs = {}, jade_dump_json, jade_load_json, jade_load_edx;
jade_defs.jade = function() {
    var a = this;
    $.extend(a, jade_defs.top_level(a)),
    a.model = jade_defs.model(a),
    jade_defs.netlist(a),
    jade_defs.icons(a),
    a.schematic_view = jade_defs.schematic_view(a),
    a.icon_view = jade_defs.icon_view(a),
    a.property_view = jade_defs.property_view(a),
    a.test_view = jade_defs.test_view(a),
    a.utils = jade_defs.utils(a),
    a.plot = jade_defs.plot(a),
    a.device_level = jade_defs.device_level(a),
    a.cktsim = jade_defs.cktsim(a),
    a.gate_level = jade_defs.gate_level(a),
    a.gatesim = jade_defs.gatesim(a),
    jade_defs.analog(a),
    jade_defs.gates(a)
}
,
jade_defs.top_level = function(jade) {
    function Jade(a) {
        a.jade = this,
        this.jade = jade,
        this.parent = a,
        this.module = void 0,
        this.configuration = {},
        this.top_level = $('<div class="jade-top-level"> <div id="module-tools" class="jade-toolbar"></div> <div class="jade-tabs-div"></div> <div class="jade-resize-icon"></div> <div class="jade-version"><a href="#">' + version + '</a></div> <div class="jade-status"><span id="message"></span></div></div>'),
        $(".jade-resize-icon", this.top_level).append(jade.icons.resize_icon),
        $(a).append(this.top_level),
        $(".jade-version a", this.top_level).on("click", function(b) {
            return jade_window("About Jade", $('<div class="jade-about"></div>').html(about_msg), $(a).offset()),
            b.preventDefault(),
            !1
        }
        ),
        this.status = this.top_level.find("#message"),
        this.module_tools = this.top_level.find("#module-tools"),
        this.module_tools.append('<span>Module:</span><select id="module-select"></select>'),
        this.module_tools.append(this.module_tool(jade.icons.edit_module_icon, "edit-module", "Edit/create module", edit_module, "hierarchy-tool")),
        this.module_tools.append(this.module_tool(jade.icons.copy_module_icon, "copy-module", "Copy current module", copy_module, "hierarchy-tool")),
        this.module_tools.append(this.module_tool(jade.icons.delete_module_icon, "delete-module", "Delete current module", delete_module, "hierarchy-tool")),
        this.module_tools.append(this.module_tool(jade.icons.download_icon, "download-modules", "Save modules to module clipboard", download_modules)),
        this.module_tools.append(this.module_tool(jade.icons.upload_icon, "upload-modules", "Select modules to load from module clipboard", upload_modules)),
        this.module_tools.append(this.module_tool(jade.icons.recycle_icon, "start-over", "Discard all work on this problem and start over", start_over)),
        $("#module-select", this.module_tools).on("change", function() {
            a.jade.edit($(this).val())
        }
        ),
        this.tabs_div = this.top_level.find(".jade-tabs-div"),
        this.tabs = {},
        this.selected_tab = void 0,
        this.status.text("Copyright \xa9 MIT EECS 2011-2015");
        var b = this;
        $(a).hasClass("jade-resize") ? $(".jade-resize-icon", this.top_level).css("display", "inline").on("mousedown", function(c) {
            function d(a) {
                var c = g.width() + a.pageX - h
                  , d = g.height() + a.pageY - i;
                return g.width(c),
                g.height(d),
                b.resize(g.width(), g.height()),
                h = a.pageX,
                i = a.pageY,
                !1
            }
            function e() {
                return f.removeEventListener("mousemove", d, !0),
                f.removeEventListener("mouseup", d, !0),
                !1
            }
            var f = $(document).get(0)
              , g = $(a)
              , h = c.pageX
              , i = c.pageY;
            return f.addEventListener("mousemove", d, !0),
            f.addEventListener("mouseup", e, !0),
            !1
        }
        ) : $(window).on("resize", function() {
            var a = $("body")
              , c = $(window).width() - (a.outerWidth(!0) - a.width()) - 8
              , d = $(window).height() - (a.outerHeight(!0) - a.height()) - 8;
            b.resize(c, d)
        }
        )
    }
    function edit_module(a) {
        function b() {
            function f(a) {
                $("#msg", d).text(a),
                $("#msg", d).show(),
                dialog("Edit Module", d, b, c)
            }
            var g = $(e).val();
            "/" != g[0] && (g = "/user/" + g);
            var h = !0;
            if ($.each(g.split("/"), function(a, b) {
                jade.utils.validate_name(b) || (h = !1)
            }
            ),
            !h)
                return void f("Invalid module name: " + g);
            var i = jade.model.find_module(g);
            a.edit(i.get_name())
        }
        var c = $(".jade-tabs-div", a.top_level).offset()
          , d = $('<div style="margin:10px;"><div id="msg" style="display:none;color:red;margin-bottom:10px;"></div></div>');
        d.append("Module name:");
        var e = build_input("text", 10, "");
        $(e).css("vertical-align", "middle"),
        d.append(e),
        dialog("Edit Module", d, b, c)
    }
    function delete_module(a) {
        function b() {
            var b = a.module;
            jade.model.remove_module(b.name),
            a.edit(jade.model.find_module("/user/untitled"))
        }
        var c = $(".jade-tabs-div", a.top_level).offset()
          , d = $('<div style="margin:10px;width:300px;">Click OK to confirm the deletion of module <span id="mname"></span>.  Note that this action cannot be undone.</div>');
        $("#mname", d).text(a.module.get_name()),
        dialog("Delete Module", d, b, c)
    }
    function copy_module(a) {
        function b() {
            function f(a) {
                $("#msg", d).text(a),
                $("#msg", d).show(),
                dialog("Copy Module", d, b, c)
            }
            var g = $(e).val()
              , h = !0;
            if ($.each(g.split("/"), function(a, b) {
                jade.utils.validate_name(b) || (h = !1)
            }
            ),
            !h)
                return void f("Invalid module name: " + g);
            if (g in jade.model.get_modules())
                return void f("Module already exists: " + g);
            var i = jade.model.find_module(g, a.module.json());
            i.shared = !1,
            i.remove_property("readonly"),
            i.set_modified(),
            a.edit(i)
        }
        var c = $(".jade-tabs-div", a.top_level).offset()
          , d = $('<div style="margin:10px;"><div id="msg" style="display:none;color:red;margin-bottom:10px;"></div></div>');
        d.append("New module name:");
        var e = build_input("text", 10, "");
        $(e).css("vertical-align", "middle"),
        d.append(e),
        dialog("Copy Module", d, b, c)
    }
    function download_modules() {
        var a = JSON.parse(localStorage.getItem("jade_saved_modules") || "{}");
        $.extend(a, jade.model.json_modules().json),
        localStorage.setItem("jade_saved_modules", JSON.stringify(a))
    }
    function upload_modules(j, event) {
        function load_answer() {
            var s = eval($("textarea", content).val())
              , edx_state = JSON.parse(s).state
              , design = JSON.parse(edx_state).state;
            jade.model.load_json(design);
            var modules = Object.keys(design);
            j.edit(modules[0]),
            console.log(modules)
        }
        function upload() {
            $.each(select, function(a, b) {
                var c = $("input", b)
                  , d = c.attr("name");
                c[0].checked && jade.model.find_module(d, modules[d])
            }
            ),
            j.edit(j.module)
        }
        if (event && event.shiftKey) {
            var content = $('<div style="margin:10px;"><textarea rows="5" cols="80"/></div>')
              , offset = $(".jade-tabs-div", j.top_level).offset();
            return void dialog("Load student answer", content, load_answer, offset)
        }
        var modules = JSON.parse(localStorage.getItem("jade_saved_modules") || "{}")
          , mnames = Object.keys(modules).sort()
          , select = [];
        $.each(mnames, function(a, b) {
            var c = $('<input type="checkbox" value=""></input>').attr("name", b);
            select.push($('<div class="jade-module-select"></div>').append(c, b))
        }
        );
        var row = $('<tr valign="top"></tr>')
          , ncols = Math.max(3, Math.ceil(select.length / 10))
          , select_all = $('<td><a href="">Select all</a></td>');
        select_all.attr("colspan", ncols.toString());
        for (var nitems = Math.ceil(select.length / ncols), col, index = 0, i; ncols--; ) {
            for (col = $("<td></td>"),
            i = 0; nitems > i; i += 1)
                col.append(select[index++]);
            row.append(col)
        }
        var contents = $("<table></table>").append(row, $('<tr align="center"></tr>').append(select_all));
        $("a", select_all).on("click", function(a) {
            return $("input", row).prop("checked", !0),
            a.preventDefault(),
            !1
        }
        );
        var offset = $(".jade-tabs-div", j.top_level).offset();
        dialog("Select modules to load", contents, upload, offset)
    }
    function start_over(a) {
        function b() {
            delete a.configuration.state,
            delete a.configuration.tests,
            a.initialize(a.configuration),
            jade.model.save_modules(!0)
        }
        var c = $(".jade-tabs-div", a.top_level).offset();
        dialog("Start over?", $("<span>Click OK to discard all work on this problem and start over again.</span>"), b, c)
    }
    function Diagram(a, b) {
        this.editor = a,
        this.aspect = void 0,
        this.canvas = $("<canvas></canvas>").addClass(b)[0];
        {
            var c = this.canvas.getContext("2d");
            window.devicePixelRatio || 1,
            c.webkitBackingStorePixelRatio || c.mozBackingStorePixelRatio || c.msBackingStorePixelRatio || c.oBackingStorePixelRatio || c.backingStorePixelRatio || 1
        }
        this.pixelRatio = 1,
        this.sctl_r = 16,
        this.sctl_x = this.sctl_r + 8,
        this.sctl_y = this.sctl_r + 8,
        this.zctl_left = this.sctl_x - 8,
        this.zctl_top = this.sctl_y + this.sctl_r + 8,
        this.background_style = "rgb(250,250,250)",
        this.grid_style = "rgb(230,230,230)",
        this.control_style = "rgb(0,0,0)",
        this.normal_style = "rgb(88,110,117)",
        this.component_style = "rgb(38,139,210)",
        this.selected_style = "rgb(211,54,130)",
        this.annotation_style = "rgb(220,50,47)",
        this.property_font = "5pt sans-serif",
        this.annotation_font = "6pt sans-serif",
        this.bg_image = $("<canvas></canvas>")[0],
        this.bg_image.getContext("2d").scale(this.pixelRatio, this.pixelRatio),
        this.canvas.tabIndex = 1,
        this.canvas.diagram = this,
        this.dragging = !1,
        this.select_rect = void 0,
        this.annotations = [],
        this.show_grid = !0,
        this.origin_x = 0,
        this.origin_y = 0,
        this.cursor_x = 0,
        this.cursor_y = 0,
        this.unsel_bbox = [1 / 0, 1 / 0, -1 / 0, -1 / 0],
        this.bbox = [0, 0, 0, 0]
    }
    function diagram_toggle_grid(a) {
        a.show_grid = !a.show_grid,
        a.redraw_background()
    }
    function diagram_undo(a) {
        a.aspect.undo(),
        a.unselect_all(-1),
        a.redraw_background()
    }
    function diagram_redo(a) {
        a.aspect.redo(),
        a.unselect_all(-1),
        a.redraw_background()
    }
    function diagram_cut(a) {
        clipboards[a.editor.editor_name] = [],
        a.aspect.start_action(),
        a.aspect.map_over_components(function(b) {
            b.selected && (b.remove(),
            clipboards[a.editor.editor_name].push(b))
        }
        ),
        a.aspect.end_action(),
        a.editor.diagram_changed(a),
        a.redraw()
    }
    function diagram_copy(a) {
        clipboards[a.editor.editor_name] = [],
        a.aspect.map_over_components(function(b) {
            b.selected && clipboards[a.editor.editor_name].push(b.clone(b.coords[0], b.coords[1]))
        }
        ),
        a.redraw()
    }
    function diagram_paste(a, b) {
        var c, d, e, f, g = clipboards[a.editor.editor_name], h = 1;
        for (c = g.length - 1; c >= 0; c -= 1)
            d = g[c],
            e = e ? Math.min(e, d.coords[0]) : d.coords[0],
            f = f ? Math.min(f, d.coords[1]) : d.coords[1],
            h = Math.max(h, d.required_grid);
        a.set_cursor_grid(h),
        e = a.on_grid(e),
        f = a.on_grid(f),
        a.unselect_all(-1),
        a.redraw_background();
        var i = b ? a.cursor_x : e + 16
          , j = b ? a.cursor_y : f + 16;
        for (a.aspect.start_action(),
        c = g.length - 1; c >= 0; c -= 1) {
            d = g[c];
            var k = d.clone(i + (d.coords[0] - e), j + (d.coords[1] - f));
            k.set_select(!0),
            k.add(a.aspect)
        }
        a.aspect.end_action(),
        a.editor.diagram_changed(a),
        a.redraw()
    }
    function diagram_fliph(a) {
        a.rotate(4)
    }
    function diagram_flipv(a) {
        a.rotate(6)
    }
    function diagram_rotcw(a) {
        a.rotate(1)
    }
    function diagram_rotccw(a) {
        a.rotate(3)
    }
    function progress_report() {
        var a = $('<div class="jade-progress"><div class="jade-progress-wrapper"><div class="jade-progress-bar" style="width:0%"></div></div><button id="stop">Stop</button></div>');
        a[0].update_progress = function(b) {
            a.find(".jade-progress-bar").css("width", b + "%")
        }
        ;
        var b = a.find("#stop");
        return b.on("click", function(b) {
            return a[0].stop_requested = !0,
            b.preventDefault(),
            !1
        }
        ),
        a
    }
    function dialog(a, b, c, d) {
        var e = $('<div> <div class="jade-dialog-content"></div> <div class="jade-dialog-buttons">  <span id="ok" class="jade-dialog-button">OK</span>  <span id="cancel" class="jade-dialog-button">Cancel</span></div></div>');
        e[0].callback = c;
        var f;
        $(b).find(".property").each(function(a, b) {
            var c = $(b);
            0 == a && (f = c),
            b.dialog = e[0],
            c.hasClass("newline-allowed") || c.keypress(function(a) {
                13 == a.keyCode && e.find("#ok").trigger("click")
            }
            ),
            c.focus(function() {
                c.select()
            }
            )
        }
        ),
        e.find(".jade-dialog-content").append(b),
        e.find("#ok").on("click", function(a) {
            return window_close(e[0].win),
            e[0].callback && setTimeout(function() {
                e[0].callback()
            }
            , 1),
            a.preventDefault(),
            !1
        }
        ),
        e.find("#cancel").on("click", function(a) {
            return window_close(e[0].win),
            a.preventDefault(),
            !1
        }
        ),
        jade_window(a, e[0], d),
        f && f.focus()
    }
    function build_table(a) {
        var b = $("<table><tbody></tbody></table>");
        for (var c in a) {
            var d = $('<tr valign="center"><td><nobr>' + c + ':</nobr></td><td id="field"></td></tr>');
            d.find("#field").append(a[c]),
            b.append(d)
        }
        return b[0]
    }
    function build_button(a, b) {
        var c = $("<button>" + a + "</button>").click(b);
        return c[0]
    }
    function build_input(a, b, c) {
        var d;
        return "text" == a || "string" == a ? (d = $('<textarea class="property" autocorrect="off" autocapitalize="off" rows="1"></textarea>'),
        "string" == a && d.addClass("newline-allowed")) : d = $('<input class="property" autocorrect="off" autocapitalize="off"></input>').attr("type", a).attr("size", b),
        d.val(void 0 === c ? "" : c.toString()),
        d[0]
    }
    function build_select(a, b, c) {
        c = $(void 0 === c ? "<select></select>" : c),
        c.empty();
        for (var d = 0; d < a.length; d += 1) {
            var e = $("<option>" + a[d] + "</option>");
            c.append(e),
            a[d] == b && e.attr("selected", "true")
        }
        return c[0]
    }
    function jade_window(a, b, c) {
        var d = $('<div class="jade-window"> <div class="jade-window-title">' + a + '<span style="float:right;cursor: pointer">' + jade.icons.close_icon + "</span></div></div>");
        d[0].content = b,
        d[0].drag_x = void 0,
        d[0].draw_y = void 0;
        var e = d.find(".jade-window-title").mousedown(window_mouse_down);
        e[0].win = d[0],
        d[0].head = e[0];
        d.find("span").click(function(a) {
            return window_close(d[0]),
            a.preventDefault(),
            !1
        }
        );
        if (d.append($(b)),
        b.win = d[0],
        $(b).toggleClass("jade-window-contents"),
        b.resize) {
            var f = $('<div class="jade-window-resize"></div>');
            f.append($(jade.icons.resize_icon).css("pointer-events", "none")),
            f[0].win = d[0],
            d[0].resize = function(a, c) {
                var e = d;
                e.height(e.height() + c),
                e.width(e.width() + a),
                e = $(b),
                b.resize(b, e.width() + a, e.height() + c)
            }
            ,
            f.mousedown(window_resize_start),
            d.append(f)
        }
        return $("body").append(d),
        c && d.offset(c),
        bring_to_front(d[0], !0),
        d
    }
    function bring_to_front(a, b) {
        var c = window_list.indexOf(a);
        for (-1 != c && window_list.splice(c, 1),
        b && window_list.push(a),
        c = 0; c < window_list.length; c += 1)
            $(window_list[c]).css("z-index", 100 + c)
    }
    function window_close(a) {
        $(a).remove(),
        bring_to_front(a, !1)
    }
    function window_close_button(a) {
        window_close(a.target.win)
    }
    function window_mouse_down(a) {
        function b(a) {
            var b = a.pageX - g
              , c = a.pageY - h;
            g += b,
            h += c;
            var d = $(f).offset();
            return d && (d.top += c,
            d.left += b,
            $(f).offset(d)),
            !1
        }
        function c() {
            return e.removeEventListener("mousemove", b, !0),
            e.removeEventListener("mouseup", c, !0),
            !1
        }
        var d = window.event || a
          , e = $(document).get(0)
          , f = d.target.win;
        bring_to_front(f, !0);
        var g = d.pageX
          , h = d.pageY;
        return e.addEventListener("mousemove", b, !0),
        e.addEventListener("mouseup", c, !0),
        !1
    }
    function window_resize_start(a) {
        function b(a) {
            var b = window.event || a;
            return d.resize(b.pageX - e, b.pageY - f),
            e = b.pageX,
            f = b.pageY,
            !1
        }
        function c() {
            return g.removeEventListener("mousemove", b, !0),
            g.removeEventListener("mouseup", c, !0),
            !1
        }
        var d = a.target.win
          , e = a.pageX
          , f = a.pageY
          , g = $(document).get(0);
        return g.addEventListener("mousemove", b, !0),
        g.addEventListener("mouseup", c, !0),
        !1
    }
    function Toolbar(a) {
        this.diagram = a,
        this.tools = {},
        this.toolbar = $('<div class="jade-toolbar noselect"></div>')
    }
    function tool_enter(a) {
        var b = a.target;
        b.enabled && b.diagram.message(b.tip)
    }
    function tool_leave(a) {
        var b = a.target;
        b.enabled && b.diagram.clear_message(b.tip)
    }
    function tool_click(a) {
        var b = a.target;
        return b.enabled && (b.diagram.event_coords(a),
        b.callback(b.diagram)),
        a.preventDefault(),
        !1
    }
    var version = "Jade 2.2.45 (2015 \xa9 MIT EECS)"
      , about_msg = version + "<p>Chris Terman wrote the schematic entry, testing and gate-level simulation tools.<p>Jacob White wrote the simulation engine for the device-level simulation tools.<p>We are grateful to Quanta Computer Incorporated for their support of the development of the Jade schematic entry and simulation tool as part of a research project on educational technologies with the MIT Computer Science and Artificial Intelligence Laboratory."
      , editors = []
      , clipboards = {};
    Jade.prototype.module_tool = function(a, b, c, d, e) {
        var f = $("<span></span>").append(a).addClass("jade-module-tool jade-tool-enabled").attr("id", b);
        e && f.addClass(e);
        var g = this;
        return f.on("click", function(a) {
            return d && d(g, a),
            a.preventDefault(),
            !1
        }
        ),
        f.on("mouseenter", function() {
            g.status.html(c)
        }
        ),
        f.on("mouseleave", function() {
            g.status.html("")
        }
        ),
        f
    }
    ,
    jade_dump_json = function(a) {
        var b = new RegExp(a)
          , c = {};
        return $.each(jade.model.get_modules(), function(a, d) {
            b.test(a) && (c[a] = d.json())
        }
        ),
        JSON.stringify(c)
    }
    ,
    jade_load_json = function(a) {
        jade.model.load_json(JSON.parse(a))
    }
    ,
    jade_load_edx = function(a) {
        var b = JSON.parse(a).state
          , c = JSON.parse(b).state;
        jade.model.load_json(c);
        var d = Object.keys(c);
        return $(".jade")[0].jade.edit(d[0]),
        d
    }
    ,
    Jade.prototype.initialize = function(a) {
        var b = this;
        $.extend(this.configuration, a),
        $("#start-over", this.module_tools).toggle(this.configuration.state && this.configuration.initial_state),
        void 0 === this.configuration.tests && (this.configuration.tests = {}),
        this.configuration.shared_modules && $.each(this.configuration.shared_modules, function(a, b) {
            jade.model.load_modules(b, !0)
        }
        ),
        this.configuration.modules && ("string" == typeof this.configuration.modules && (this.configuration.modules = this.configuration.modules.split(",")),
        $.each(this.configuration.modules, function(a, b) {
            jade.model.load_modules(b, !1)
        }
        )),
        $(".hierarchy-tool", this.top_level).toggle("true" == this.configuration.hierarchical);
        var c;
        this.configuration.editors ? (c = [],
        $.each(this.configuration.editors, function(a, b) {
            $.each(editors, function(a, d) {
                d.prototype.editor_name == b && c.push(d)
            }
            )
        }
        )) : c = editors,
        b.tabs_div.empty(),
        $(".jade-tab-body", b.top_level).remove(),
        $.each(c, function(a, c) {
            var d = c.prototype.editor_name;
            clipboards[d] = [];
            var e = $('<div class="jade-tab">' + d + "</div>");
            b.tabs_div.append(e),
            e.click(function(a) {
                return b.show(d),
                a.preventDefault(),
                !1
            }
            );
            var f = $('<div class="jade-tab-body"></div>');
            f[0].tab = e[0],
            b.top_level.find(".jade-tabs-div").after(f),
            f[0].editor = new c(f[0],b),
            b.tabs[d] = [e[0], f[0]],
            f.on("mouseleave", function() {
                jade.model.save_modules()
            }
            )
        }
        ),
        c.length > 0 && this.show(c[0].prototype.editor_name),
        $(this.parent).hasClass("jade-resize") ? this.resize($(this.parent).width(), $(this.parent).height()) : $(window).trigger("resize"),
        this.configuration.initial_state && (jade.model.load_json(this.configuration.initial_state),
        jade.model.set_clean()),
        this.configuration.state && jade.model.load_json(this.configuration.state);
        var d = this.configuration.edit || "/user/untitled";
        "/" != d[0] && (d = "/user/" + d);
        var e = d.split(".");
        this.edit(e[0]),
        e.length > 1 && this.show(e[1])
    }
    ,
    Jade.prototype.get_state = function() {
        var a = {
            tests: this.configuration.tests,
            "required-tests": this.configuration["required-tests"],
            state: jade.model.json_modules(!0).json
        };
        return jade.model.clear_modified(),
        a
    }
    ,
    Jade.prototype.get_grade = function() {
        return {
            "required-tests": this.configuration["required-tests"] || [],
            tests: this.configuration.tests || {}
        }
    }
    ,
    Jade.prototype.bookmark = function() {
        if (void 0 !== this.module) {
            var a = this.module.get_name();
            void 0 !== this.selected_tab && (a += "." + this.selected_tab)
        }
    }
    ,
    Jade.prototype.edit = function(a) {
        "string" == typeof a && (a = jade.model.find_module(a)),
        this.module = a;
        var b = (this.configuration.parts || [".*"]).map(function(a) {
            return new RegExp(a)
        }
        )
          , c = [];
        jade.model.map_modules(b, function(a) {
            if (!a.confidential()) {
                var b = a.get_name();
                -1 == c.indexOf(b) && c.push(b)
            }
        }
        ),
        build_select(c.sort(), a.get_name(), $("#module-select", this.module_tools)),
        a.shared ? ($("#delete-module", this.module_tools).removeClass("jade-tool-enabled"),
        $("#delete-module", this.module_tools).addClass("jade-tool-disabled")) : ($("#delete-module", this.module_tools).removeClass("jade-tool-disabled"),
        $("#delete-module", this.module_tools).addClass("jade-tool-enabled")),
        this.bookmark(),
        this.refresh(),
        jade.model.save_modules()
    }
    ,
    Jade.prototype.refresh = function() {
        if (void 0 !== this.module)
            for (var a in this.tabs)
                this.tabs[a][1].editor.set_aspect(this.module)
    }
    ,
    Jade.prototype.show = function(a) {
        this.selected_tab = a,
        this.bookmark();
        for (var b in this.tabs) {
            var c = this.tabs[b]
              , d = b == a;
            $(c[0]).toggleClass("jade-tab-active", d),
            $(c[1]).toggleClass("jade-tab-body-active", d),
            d && c[1].editor.show()
        }
    }
    ,
    Jade.prototype.resize = function(a, b) {
        var c = $(this.top_level)
          , d = c.outerWidth(!0) - c.width()
          , e = c.outerHeight(!0) - c.height();
        a -= d,
        b -= e + $("#module-tools").outerHeight(!0) + $(".jade-tabs-div", c).outerHeight(!0) + $(".jade-status", c).outerHeight(!0);
        for (var f in this.tabs) {
            var g = this.tabs[f][1];
            c = $(g),
            d = c.outerWidth(!0) - c.width(),
            e = c.outerHeight(!0) - c.height();
            var h = a - d
              , i = b - e;
            c.width(h),
            c.height(i),
            g.editor.resize(h, i, f == this.selected_tab)
        }
    }
    ,
    Diagram.prototype.getAttribute = function() {
        return void 0
    }
    ,
    Diagram.prototype.set_aspect = function(a) {
        this.aspect = a,
        this.show_grid = !0,
        this.redraw_background(),
        this.zoomall()
    }
    ,
    Diagram.prototype.unselect_all = function(a) {
        this.annotations = [],
        this.aspect.map_over_components(function(b, c) {
            c != a && b.set_select(!1)
        }
        )
    }
    ,
    Diagram.prototype.remove_annotations = function() {
        this.unselect_all(),
        this.redraw_background()
    }
    ,
    Diagram.prototype.add_annotation = function(a) {
        this.annotations.push(a),
        this.redraw()
    }
    ,
    Diagram.prototype.drag_begin = function() {
        var a = 1;
        this.aspect.map_over_components(function(b) {
            b.selected && (b.move_begin(),
            a = Math.max(a, b.required_grid))
        }
        ),
        this.set_cursor_grid(a),
        this.drag_x = this.cursor_x,
        this.drag_y = this.cursor_y,
        this.dragging = !0
    }
    ,
    Diagram.prototype.drag_end = function() {
        this.aspect.map_over_components(function(a) {
            a.selected && a.move_end()
        }
        ),
        this.dragging = !1,
        this.aspect.end_action(),
        this.editor.diagram_changed(this),
        this.redraw_background()
    }
    ,
    Diagram.prototype.zoomin = function() {
        var a = this.scale * this.zoom_factor;
        a < this.zoom_max && (this.origin_x += $(this.canvas).width() / 2 * (1 / this.scale - 1 / a),
        this.origin_y += $(this.canvas).height() / 2 * (1 / this.scale - 1 / a),
        this.scale = a,
        this.redraw_background())
    }
    ,
    Diagram.prototype.zoomout = function() {
        var a = this.scale / this.zoom_factor;
        a > this.zoom_min && (this.origin_x += this.canvas.width / 2 * (1 / this.scale - 1 / a),
        this.origin_y += this.canvas.height / 2 * (1 / this.scale - 1 / a),
        this.scale = a,
        this.redraw_background())
    }
    ,
    Diagram.prototype.zoomall = function() {
        var a = 1.5 * (this.bbox[2] - this.bbox[0])
          , b = 1.5 * (this.bbox[3] - this.bbox[1]);
        if (0 === a)
            this.scale = 1;
        else {
            var c = this.canvas.width / a
              , d = this.canvas.height / b;
            this.scale = Math.pow(this.zoom_factor, Math.ceil(Math.log(Math.min(c, d)) / Math.log(this.zoom_factor))),
            this.scale < this.zoom_min ? this.scale = this.zoom_min : this.scale > this.zoom_max && (this.scale = this.zoom_max)
        }
        this.origin_x = (this.bbox[2] + this.bbox[0]) / 2 - this.canvas.width / (2 * this.scale),
        this.origin_y = (this.bbox[3] + this.bbox[1]) / 2 - this.canvas.height / (2 * this.scale),
        this.redraw_background()
    }
    ,
    Diagram.prototype.set_cursor_grid = function(a) {
        this.cursor_grid = a,
        this.cursor_x = this.on_grid(this.aspect_x),
        this.cursor_y = this.on_grid(this.aspect_y)
    }
    ,
    Diagram.prototype.on_grid = function(a, b) {
        return void 0 === b && (b = this.cursor_grid),
        0 > a ? Math.floor((-a + (b >> 1)) / b) * -b : Math.floor((a + (b >> 1)) / b) * b
    }
    ,
    Diagram.prototype.rotate = function(a) {
        var b = this.aspect.selected_bbox()
          , c = this.aspect.selected_grid()
          , d = this.on_grid(b[0] + b[2] >> 1, c)
          , e = this.on_grid(b[1] + b[3] >> 1, c);
        this.aspect.start_action(),
        this.aspect.map_over_components(function(b) {
            b.selected && (b.move_begin(),
            b.rotate(a, d, e))
        }
        ),
        b = this.aspect.selected_bbox();
        var f = d - this.on_grid(b[0] + b[2] >> 1, c)
          , g = e - this.on_grid(b[1] + b[3] >> 1, c);
        this.aspect.map_over_components(function(a) {
            a.selected && ((0 !== f || 0 !== g) && a.move(f, g),
            a.move_end())
        }
        ),
        this.aspect.end_action(),
        this.editor.diagram_changed(this),
        this.redraw()
    }
    ,
    Diagram.prototype.resize = function() {
        var a = parseFloat($(this.canvas).css("width"))
          , b = parseFloat($(this.canvas).css("height"));
        this.canvas.width = a * this.pixelRatio,
        this.canvas.height = b * this.pixelRatio,
        this.canvas.getContext("2d").scale(this.pixelRatio, this.pixelRatio),
        this.bg_image.width = a * this.pixelRatio,
        this.bg_image.height = b * this.pixelRatio,
        this.bg_image.getContext("2d").scale(this.pixelRatio, this.pixelRatio),
        this.zoomall()
    }
    ,
    Diagram.prototype.redraw_background = function() {
        var a = this.bg_image.getContext("2d");
        if (this.c = a,
        a.lineCap = "round",
        a.fillStyle = this.show_grid ? this.background_style : "white",
        a.fillRect(0, 0, this.bg_image.width, this.bg_image.height),
        !this.diagram_only && this.show_grid) {
            a.strokeStyle = this.grid_style;
            var b, c = this.origin_x, d = c + this.bg_image.width / this.scale, e = this.origin_y, f = e + this.bg_image.height / this.scale;
            for (b = this.grid * Math.ceil(c / this.grid); d > b; b += this.grid)
                this.draw_line(b, e, b, f, .2);
            for (b = this.grid * Math.ceil(e / this.grid); f > b; b += this.grid)
                this.draw_line(c, b, d, b, .2);
            this.draw_arc(0, 0, this.grid / 2, 0, 2 * Math.PI, !1, .2, !1)
        }
        this.unsel_bbox = this.aspect.unselected_bbox();
        var g = this;
        if (this.aspect.map_over_components(function(a) {
            a.selected || a.draw(g)
        }
        ),
        this.aspect && this.aspect.module) {
            var h = this.aspect.module.get_name();
            a.textAlign = "left",
            a.textBaseline = "bottom",
            a.font = "12pt sans-serif",
            a.fillStyle = this.normal_style,
            a.fillText(h, 2, this.canvas.height - 2)
        }
        this.redraw()
    }
    ,
    Diagram.prototype.redraw = function() {
        var a = this.canvas.getContext("2d");
        this.c = a,
        a.lineCap = "round",
        a.drawImage(this.bg_image, 0, 0, this.bg_image.width / this.pixelRatio, this.bg_image.height / this.pixelRatio),
        this.bbox = this.aspect.selected_bbox(this.unsel_bbox),
        1 / 0 == this.bbox[0] && (this.bbox = [0, 0, 0, 0]);
        var b = this;
        this.aspect.map_over_components(function(a) {
            a.selected && a.draw(b)
        }
        );
        for (var c in this.aspect.connection_points) {
            var d = this.aspect.connection_points[c];
            d[0].draw(this, d.length)
        }
        if (this.editor.redraw(this),
        this.select_rect) {
            var e = this.select_rect;
            a.lineWidth = 1,
            a.strokeStyle = this.selected_style,
            a.beginPath(),
            a.moveTo(e[0], e[1]),
            a.lineTo(e[0], e[3]),
            a.lineTo(e[2], e[3]),
            a.lineTo(e[2], e[1]),
            a.lineTo(e[0], e[1]),
            a.stroke()
        }
        for (var f = 0; f < this.annotations.length; f += 1)
            this.annotations[f](this);
        var g = this.sctl_r
          , h = this.sctl_x
          , i = this.sctl_y;
        a.fillStyle = this.background_style,
        a.beginPath(),
        a.arc(h, i, g, 0, 2 * Math.PI),
        a.fill(),
        a.strokeStyle = this.control_style,
        a.lineWidth = .5,
        a.beginPath(),
        a.arc(h, i, g, 0, 2 * Math.PI),
        a.stroke(),
        a.lineWidth = 3,
        a.beginPath(),
        a.moveTo(h + 4, i - g + 8),
        a.lineTo(h, i - g + 4),
        a.lineTo(h - 4, i - g + 8),
        a.moveTo(h + g - 8, i + 4),
        a.lineTo(h + g - 4, i),
        a.lineTo(h + g - 8, i - 4),
        a.moveTo(h + 4, i + g - 8),
        a.lineTo(h, i + g - 4),
        a.lineTo(h - 4, i + g - 8),
        a.moveTo(h - g + 8, i + 4),
        a.lineTo(h - g + 4, i),
        a.lineTo(h - g + 8, i - 4),
        a.stroke(),
        h = this.zctl_left,
        i = this.zctl_top,
        a.lineWidth = .5,
        a.fillStyle = this.background_style,
        a.fillRect(h, i, 16, 48),
        a.strokeStyle = this.control_style,
        a.strokeRect(h, i, 16, 48),
        a.lineWidth = 1,
        a.beginPath(),
        a.moveTo(h + 4, i + 8),
        a.lineTo(h + 12, i + 8),
        a.moveTo(h + 8, i + 4),
        a.lineTo(h + 8, i + 12),
        a.moveTo(h + 4, i + 24),
        a.lineTo(h + 12, i + 24),
        a.stroke(),
        a.strokeRect(h + 4, i + 36, 8, 8),
        a.fillStyle = this.background_style,
        a.fillRect(h + 7, i + 34, 2, 10),
        a.fillRect(h + 3, i + 39, 10, 2)
    }
    ,
    Diagram.prototype.moveTo = function(a, b) {
        var c = Math.floor((a - this.origin_x) * this.scale)
          , d = Math.floor((b - this.origin_y) * this.scale);
        1 == (1 & this.c.lineWidth) && (c += .5,
        d += .5),
        this.c.moveTo(c, d)
    }
    ,
    Diagram.prototype.lineTo = function(a, b) {
        var c = Math.floor((a - this.origin_x) * this.scale)
          , d = Math.floor((b - this.origin_y) * this.scale);
        1 == (1 & this.c.lineWidth) && (c += .5,
        d += .5),
        this.c.lineTo(c, d)
    }
    ,
    Diagram.prototype.line_width = function(a) {
        return Math.max(1, Math.floor(a * this.scale))
    }
    ,
    Diagram.prototype.draw_line = function(a, b, c, d, e) {
        var f = this.c;
        f.lineWidth = this.line_width(e),
        f.beginPath(),
        this.moveTo(a, b),
        this.lineTo(c, d),
        f.stroke()
    }
    ,
    Diagram.prototype.draw_arc = function(a, b, c, d, e, f, g, h) {
        var i = this.c;
        i.lineWidth = this.line_width(g),
        i.beginPath();
        var j = Math.floor((a - this.origin_x) * this.scale)
          , k = Math.floor((b - this.origin_y) * this.scale);
        1 == (1 & this.c.lineWidth) && (j += .5,
        k += .5),
        i.arc(j, k, c * this.scale, d, e, f),
        h ? i.fill() : i.stroke()
    }
    ,
    Diagram.prototype.draw_text = function(a, b, c, d) {
        var e = this.c
          , f = d.match(/\d+/)[0];
        f = Math.max(2, Math.round(f * this.scale)),
        e.font = d.replace(/\d+/, f.toString());
        var g = Math.floor((b - this.origin_x) * this.scale)
          , h = Math.floor((c - this.origin_y) * this.scale);
        e.fillText(a, g, h)
    }
    ,
    Diagram.prototype.draw_text_important = function(a, b, c, d) {
        this.draw_text(a, b, c, d)
    }
    ,
    Diagram.prototype.event_coords = function(a) {
        var b = $(this.canvas).offset();
        this.mouse_x = a.pageX - b.left,
        this.mouse_y = a.pageY - b.top,
        this.aspect_x = this.mouse_x / this.scale + this.origin_x,
        this.aspect_y = this.mouse_y / this.scale + this.origin_y,
        this.cursor_x = this.on_grid(this.aspect_x),
        this.cursor_y = this.on_grid(this.aspect_y)
    }
    ,
    Diagram.prototype.key_down = function(a) {
        var b = a.keyCode;
        if (16 == b || 17 == b || 18 == b || 20 == b || 91 == b || 92 == b)
            return !0;
        if ((a.ctrlKey || a.metaKey) && 65 == b)
            this.aspect.map_over_components(function(a) {
                a.set_select(!0)
            }
            ),
            this.redraw_background();
        else if ((a.ctrlKey || a.metaKey) && 67 == b)
            diagram_copy(this);
        else {
            if (this.aspect.read_only())
                return !0;
            if (8 == b || 46 == b)
                this.aspect.start_action(),
                this.aspect.map_over_components(function(a) {
                    a.selected && a.remove()
                }
                ),
                this.aspect.end_action(),
                this.editor.diagram_changed(this),
                this.redraw_background();
            else if ((a.ctrlKey || a.metaKey) && 67 == b)
                diagram_copy(this);
            else if ((a.ctrlKey || a.metaKey) && 86 == b)
                diagram_paste(this, !0);
            else if ((a.ctrlKey || a.metaKey) && 88 == b)
                diagram_cut(this);
            else if ((a.ctrlKey || a.metaKey) && 89 == b)
                diagram_redo(this);
            else {
                if (!a.ctrlKey && !a.metaKey || 90 != b)
                    return !0;
                diagram_undo(this)
            }
        }
        return a.preventDefault(),
        !1
    }
    ,
    Diagram.prototype.pan_zoom = function() {
        var a, b, c = this.mouse_x, d = this.mouse_y, e = c - this.sctl_x, f = d - this.sctl_y, g = c - this.zctl_left, h = d - this.zctl_top;
        if (e * e + f * f <= this.sctl_r * this.sctl_r)
            Math.abs(f) > Math.abs(e) ? (a = this.canvas.height / (8 * this.scale),
            f > 0 && (a = -a),
            b = this.origin_y - a,
            b > this.origin_min * this.grid && b < this.origin_max * this.grid && (this.origin_y = b)) : (a = this.canvas.width / (8 * this.scale),
            0 > e && (a = -a),
            b = this.origin_x + a,
            b > this.origin_min * this.grid && b < this.origin_max * this.grid && (this.origin_x = b));
        else {
            if (!(g >= 0 && 16 > g && h >= 0 && 48 > h))
                return !1;
            16 > h ? this.zoomin() : 32 > h ? this.zoomout() : this.zoomall()
        }
        return this.redraw_background(),
        !0
    }
    ,
    Diagram.prototype.start_select = function(a) {
        var b = -1
          , c = this;
        if (this.aspect.map_over_components(function(d, e) {
            return d.select(c.aspect_x, c.aspect_y, a) ? (d.selected && (c.aspect.read_only() || (c.aspect.start_action(),
            c.drag_begin()),
            b = e),
            !0) : !1
        }
        ),
        a)
            this.dragging || (this.panning = !0,
            this.set_cursor_grid(1),
            this.drag_x = this.cursor_x,
            this.drag_y = this.cursor_y,
            $(this.canvas).addClass("jade-panning"));
        else {
            var d = -1 != b && this.aspect.components[b].was_previously_selected;
            d || this.unselect_all(b),
            this.dragging || (this.select_rect = [this.mouse_x, this.mouse_y, this.mouse_x, this.mouse_y])
        }
        this.redraw_background()
    }
    ,
    Diagram.prototype.mouse_move = function() {
        if (this.dragging) {
            var a = this.cursor_x - this.drag_x
              , b = this.cursor_y - this.drag_y;
            (0 !== a || 0 !== b) && (this.drag_x = this.cursor_x,
            this.drag_y = this.cursor_y,
            this.aspect.map_over_components(function(c) {
                c.selected && c.move(a, b)
            }
            ))
        } else if (this.select_rect)
            this.select_rect[2] = this.mouse_x,
            this.select_rect[3] = this.mouse_y;
        else if (this.panning) {
            var a = this.cursor_x - this.drag_x
              , b = this.cursor_y - this.drag_y;
            if (0 !== a || 0 !== b) {
                this.drag_x = this.cursor_x,
                this.drag_y = this.cursor_y;
                var c = this.origin_x - a
                  , d = this.origin_y - b;
                c > this.origin_min * this.grid && c < this.origin_max * this.grid && d > this.origin_min * this.grid && d < this.origin_max * this.grid && (this.origin_x = c,
                this.origin_y = d,
                this.drag_x -= a,
                this.drag_y -= b,
                this.redraw_background())
            }
        }
        this.redraw()
    }
    ,
    Diagram.prototype.mouse_up = function(a) {
        if (this.dragging && this.drag_end(),
        this.select_rect) {
            var b = this.select_rect;
            if (b[0] != b[2] || b[1] != b[3]) {
                var c = [b[0] / this.scale + this.origin_x, b[1] / this.scale + this.origin_y, b[2] / this.scale + this.origin_x, b[3] / this.scale + this.origin_y];
                jade.model.canonicalize(c),
                a || this.unselect_all(),
                this.aspect.map_over_components(function(b) {
                    b.select_rect(c, a)
                }
                )
            }
            this.select_rect = void 0,
            this.redraw_background()
        }
        this.panning && (this.panning = !1,
        $(this.canvas).removeClass("jade-panning"))
    }
    ,
    Diagram.prototype.message = function(a) {
        var b = this.editor.status;
        b && b.html(a)
    }
    ,
    Diagram.prototype.clear_message = function(a) {
        var b = this.editor.status;
        b && b.text() == a && b.text("")
    }
    ,
    Diagram.prototype.dialog = function(a, b, c) {
        var d = $(this.canvas).offset();
        d.top += this.mouse_y,
        d.left += this.mouse_x,
        dialog(a, b, c, d)
    }
    ,
    Diagram.prototype.window = function(a, b, c) {
        var d = $(this.canvas).offset();
        d.top += this.mouse_y + (c || 0),
        d.left += this.mouse_x + (c || 0),
        jade_window(a, b, d)
    }
    ;
    var window_list = [];
    return Toolbar.prototype.add_tool = function(a, b, c, d, e) {
        var f;
        return -1 != b.search("data:image") ? (f = $('<img draggable="false"></img>'),
        f.attr("src", b)) : f = $("<button></button>").append(b),
        f.addClass("jade-tool jade-tool-disabled"),
        f[0].enabled = !1,
        f.mouseover(tool_enter).mouseout(tool_leave).click(tool_click),
        f[0].diagram = this.diagram,
        f[0].tip = c,
        f[0].callback = d,
        f[0].enable_check = e,
        this.tools[a] = f,
        this.toolbar.append(f),
        f
    }
    ,
    Toolbar.prototype.add_spacer = function() {
        this.toolbar.append('<div class="jade-tool-spacer"></div>')
    }
    ,
    Toolbar.prototype.enable_tools = function(a) {
        for (var b in this.tools) {
            var c = this.tools[b]
              , d = c[0].enable_check ? c[0].enable_check(a) : !0;
            d != c[0].enabled && (c[0].enabled = d,
            c.toggleClass("jade-tool-disabled", !d),
            c.toggleClass("jade-tool-enabled", d))
        }
    }
    ,
    {
        Jade: Jade,
        Diagram: Diagram,
        diagram_toggle_grid: diagram_toggle_grid,
        diagram_undo: diagram_undo,
        diagram_redo: diagram_redo,
        diagram_cut: diagram_cut,
        diagram_copy: diagram_copy,
        diagram_paste: diagram_paste,
        diagram_fliph: diagram_fliph,
        diagram_flipv: diagram_flipv,
        diagram_rotcw: diagram_rotcw,
        diagram_rotccw: diagram_rotccw,
        Toolbar: Toolbar,
        Jade: Jade,
        editors: editors,
        clipboards: clipboards,
        build_table: build_table,
        build_button: build_button,
        build_input: build_input,
        build_select: build_select,
        progress_report: progress_report,
        dialog: dialog,
        window: jade_window,
        window_close: window_close
    }
}
,
jade_defs.global_check = function() {
    var a = "$,jQuery,jade_defs".split(",")
      , b = document.createElement("iframe");
    b.style.display = "none",
    document.body.appendChild(b),
    b.src = "about:blank",
    b = b.contentWindow || b.contentDocument;
    var c = [];
    for (var d in window)
        "undefined" == typeof b[d] && -1 == a.indexOf(d) && c.push(d);
    return c
}
,
jade_defs.model = function(a) {
    function b() {
        return z
    }
    function c() {
        z = {}
    }
    function d(b, c) {
        a.load_from_server(b, c, function(a) {
            "string" == typeof a && (a = JSON.parse(a)),
            e(a, c)
        }
        )
    }
    function e(a, b) {
        try {
            $.each(a, function(a, c) {
                "/" != a[0] && (a = "/user/" + a);
                j(a, c);
                b && (z[a].shared = !0)
            }
            )
        } catch (c) {
            console.log(c.stack)
        }
    }
    function f(a) {
        var b = !1
          , c = {};
        return $.each(z, function(d, e) {
            if (b |= e.modified,
            !e.shared) {
                var f = e.json(a);
                Object.keys(f).length > 0 && (c[d] = f)
            }
        }
        ),
        {
            modified: b,
            json: c
        }
    }
    function g(b) {
        var c = f();
        (b || c.modified) && a.save_to_server(c.json, h)
    }
    function h() {
        a.unsaved_changes(!1),
        $.each(z, function(a, b) {
            b.shared || b.clear_modified()
        }
        )
    }
    function i() {
        $.each(z, function(a, b) {
            b.set_clean()
        }
        )
    }
    function j(a, b) {
        var c = z[a];
        return void 0 === c ? (c = new m(a,b),
        z[a] = c) : b && c.load(b),
        c
    }
    function k(a) {
        a in z && (delete z[a],
        g(!0))
    }
    function l(a, b) {
        a instanceof Array || (a = [a]),
        $.each(a, function(a, c) {
            c instanceof RegExp || (c = new RegExp(c)),
            $.each(z, function(a, d) {
                c.test(a) && b(d)
            }
            )
        }
        )
    }
    function m(a, b) {
        this.name = a,
        this.aspects = {},
        this.properties = {
            name: {
                edit: "yes",
                type: "name",
                value: "",
                label: "Name"
            }
        },
        this.modified = !1,
        this.properties_clean = !1,
        this.loaded = !1,
        this.listeners = [],
        b && this.load(b)
    }
    function n(a, b, c) {
        this.module = b,
        this.name = a,
        this.components = [],
        this.modified = !1,
        this.clean = !1,
        this.connection_points = {},
        this.actions = [],
        this.current_action = -1,
        this.change_list = void 0,
        c && this.load(c)
    }
    function o(a) {
        var b;
        a[0] > a[2] && (b = a[0],
        a[0] = a[2],
        a[2] = b),
        a[1] > a[3] && (b = a[1],
        a[1] = a[3],
        a[3] = b)
    }
    function p(a, b, c) {
        return a >= b && c >= a
    }
    function q(a, b) {
        var c = !(b[0] > a[2] || b[2] < a[0] || b[1] > a[3] || b[3] < a[1]);
        return c
    }
    function r(a, b, c) {
        return 0 === a || 6 == a ? b : 1 == a || 5 == a ? -c : 2 == a || 4 == a ? -b : c
    }
    function s(a, b, c) {
        return 1 == a || 7 == a ? b : 2 == a || 6 == a ? -c : 3 == a || 5 == a ? -b : c
    }
    function t(a) {
        var b = B[a[0]];
        return b ? new b(a) : ("/" != a[0][0] && (a[0] = "/user/" + a[0]),
        new u(a))
    }
    function u(a) {
        this.aspect = void 0,
        this.module = void 0,
        this.icon = void 0,
        this.coords = [0, 0, 0],
        this.properties = {},
        this.selected = !1,
        this.bounding_box = [0, 0, 0, 0],
        this.bbox = this.bounding_box,
        this.connections = [],
        a && this.load(a)
    }
    function v(b, c, d, e) {
        this.parent = b,
        this.offset_x = c,
        this.offset_y = d,
        this.name = e,
        this.nlist = a.utils.parse_signal(e),
        this.location = "",
        this.update_location(),
        this.label = void 0,
        this.width = void 0,
        this.selected = !1
    }
    function w(a, b, c) {
        var d = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
        return 0 === d
    }
    var x = 25
      , y = 0
      , z = {};
    m.prototype.get_name = function() {
        return this.name
    }
    ,
    m.prototype.confidential = function() {
        return "true" == this.property_value("confidential")
    }
    ,
    m.prototype.read_only = function() {
        return this.confidential() || "true" == this.property_value("readonly")
    }
    ,
    m.prototype.add_listener = function(a) {
        this.listeners.push(a)
    }
    ,
    m.prototype.notify_listeners = function(a) {
        $.each(this.listeners, function(b, c) {
            c(a)
        }
        )
    }
    ,
    m.prototype.set_clean = function() {
        this.properties_clean = !0;
        for (var a in this.aspects)
            this.aspects[a].clean = !0
    }
    ,
    m.prototype.set_modified = function() {
        this.modified = !0,
        a.unsaved_changes(!0),
        y += 1,
        y % x == 0 && g()
    }
    ,
    m.prototype.clear_modified = function() {
        for (var a in this.aspects)
            this.aspects[a].clear_modified();
        this.modified = !1
    }
    ,
    m.prototype.property_value = function(a) {
        var b = this.properties[a];
        return void 0 !== b ? void 0 === b.value ? b : b.value : void 0
    }
    ,
    m.prototype.set_property = function(a, b) {
        b != this.properties[a] && (this.properties_clean = !1,
        this.properties[a] = b,
        this.set_modified(),
        this.properties_clean = !1)
    }
    ,
    m.prototype.set_property_attribute = function(a, b, c) {
        var d = this.properties[a];
        void 0 === d && (d = {
            edit: "yes",
            type: "string",
            value: "",
            label: a
        },
        this.properties[a] = d,
        this.set_modified()),
        c != d[b] && (d[b] = c,
        this.set_modified(),
        this.properties_clean = !1)
    }
    ,
    m.prototype.remove_property = function(a) {
        a in this.properties && (delete this.properties[a],
        this.set_modified(),
        this.properties_clean = !1)
    }
    ,
    m.prototype.load = function(a) {
        for (var b in a)
            "properties" == b ? $.extend(this.properties, a[b]) : this.aspects[b] = new n(b,this,a[b]);
        this.clear_modified(),
        this.loaded = !0;
        for (var c = this.listeners.length - 1; c >= 0; c -= 1)
            this.listeners[c]("load")
    }
    ,
    m.prototype.has_aspect = function(a) {
        return a in this.aspects ? !this.aspects[a].empty() : !1
    }
    ,
    m.prototype.aspect = function(a) {
        var b = this.aspects[a];
        return void 0 === b && (b = new n(a,this),
        this.aspects[a] = b),
        b
    }
    ,
    m.prototype.json = function(a) {
        var b = {};
        a && this.properties_clean || (b.properties = this.properties);
        for (var c in this.aspects) {
            var d = this.aspects[c];
            if (!a || !d.clean) {
                var e = d.json();
                e.length > 0 && (b[c] = e)
            }
        }
        return b
    }
    ,
    n.prototype.load = function(a) {
        this.components = [];
        for (var b = 0; b < a.length; b += 1) {
            var c = t(a[b]);
            c.add(this)
        }
        this.clear_modified(),
        this.clean = !1
    }
    ,
    n.prototype.set_modified = function() {
        this.modified = !0,
        this.clean = !1,
        this.module && this.module.set_modified()
    }
    ,
    n.prototype.clear_modified = function() {
        this.modified = !1
    }
    ,
    n.prototype.json = function() {
        for (var a = [], b = 0; b < this.components.length; b += 1)
            a.push(this.components[b].json());
        return a
    }
    ,
    n.prototype.confidential = function() {
        return this.module ? "true" == this.module.property_value(this.name + "-confidential") ? !0 : this.module.confidential() : !1
    }
    ,
    n.prototype.read_only = function() {
        return this.module ? "true" == this.module.property_value(this.name + "-readonly") ? !0 : this.module.read_only() : !1
    }
    ,
    n.prototype.empty = function() {
        return 0 === this.components.length
    }
    ,
    n.prototype.start_action = function() {
        this.change_list = []
    }
    ,
    n.prototype.end_action = function() {
        void 0 !== this.change_list && this.change_list.length > 0 && (this.clean_up_wires(!0),
        this.current_action += 1,
        this.actions.length > this.current_action && (this.actions = this.actions.slice(0, this.current_action)),
        this.actions.push(this.change_list),
        this.set_modified()),
        this.change_list = void 0
    }
    ,
    n.prototype.add_change = function(a) {
        void 0 !== this.change_list && this.change_list.push(a)
    }
    ,
    n.prototype.can_undo = function() {
        return this.current_action >= 0
    }
    ,
    n.prototype.undo = function() {
        if (this.current_action >= 0) {
            var a = this.actions[this.current_action];
            this.current_action -= 1;
            for (var b = a.length - 1; b >= 0; b -= 1)
                a[b](this, "undo");
            this.clean_up_wires(!1),
            this.set_modified()
        }
    }
    ,
    n.prototype.can_redo = function() {
        return this.current_action + 1 < this.actions.length
    }
    ,
    n.prototype.redo = function() {
        if (this.current_action + 1 < this.actions.length) {
            this.current_action += 1;
            for (var a = this.actions[this.current_action], b = 0; b < a.length; b += 1)
                a[b](this, "redo");
            this.clean_up_wires(!1),
            this.set_modified()
        }
    }
    ,
    n.prototype.add_component = function(a) {
        this.components.push(a)
    }
    ,
    n.prototype.remove_component = function(a) {
        var b = this.components.indexOf(a);
        -1 != b && this.components.splice(b, 1)
    }
    ,
    n.prototype.map_over_components = function(a) {
        for (var b = this.components.length - 1; b >= 0; b -= 1)
            if (a(this.components[b], b))
                return
    }
    ,
    n.prototype.selections = function() {
        for (var a = this.components.length - 1; a >= 0; a -= 1)
            if (this.components[a].selected)
                return !0;
        return !1
    }
    ,
    n.prototype.selected_component = function() {
        for (var a, b = this.components.length - 1; b >= 0; b -= 1)
            if (this.components[b].selected) {
                if (void 0 !== a)
                    return void 0;
                a = this.components[b]
            }
        return a
    }
    ,
    n.prototype.find_connections = function(a) {
        return this.connection_points[a.location]
    }
    ,
    n.prototype.add_connection_point = function(a) {
        var b = this.connection_points[a.location];
        return b ? b.push(a) : (b = [a],
        this.connection_points[a.location] = b),
        b
    }
    ,
    n.prototype.remove_connection_point = function(a, b) {
        var c = this.connection_points[b];
        if (c) {
            var d = c.indexOf(a);
            -1 != d && (c.splice(d, 1),
            0 === c.length && delete this.connection_points[b])
        }
    }
    ,
    n.prototype.update_connection_point = function(a, b) {
        return this.remove_connection_point(a, b),
        this.add_connection_point(a)
    }
    ,
    n.prototype.add_wire = function(a, b, c, d, e) {
        var f = t(["wire", [a, b, e, c - a, d - b]]);
        return f.add(this),
        f
    }
    ,
    n.prototype.split_wire = function(a, b) {
        a.remove(),
        this.add_wire(a.coords[0], a.coords[1], b.x, b.y, 0);
        var c = a.far_end();
        this.add_wire(c[0], c[1], b.x, b.y, 0)
    }
    ,
    n.prototype.check_wires = function(a) {
        for (var b = 0; b < this.components.length; b += 1) {
            var c = this.components[b];
            if (c != a) {
                var d = c.bisect(a);
                d && this.split_wire(c, d)
            }
        }
    }
    ,
    n.prototype.check_connection_points = function(a) {
        for (var b in this.connection_points) {
            var c = this.connection_points[b];
            if (c && a.bisect_cp(c[0]))
                return void this.split_wire(a, c[0])
        }
    }
    ,
    n.prototype.clean_up_wires = function() {
        for (var a in this.connection_points) {
            var b = this.connection_points[a];
            if (b && 2 == b.length) {
                var c = b[0].parent
                  , d = b[1].parent;
                if ("wire" == c.type() && "wire" == d.type()) {
                    var e = c.other_end(b[0])
                      , f = d.other_end(b[1])
                      , g = b[0];
                    w(e, f, g) && (c.remove(),
                    d.remove(),
                    this.add_wire(e.x, e.y, f.x, f.y, 0))
                }
            }
        }
        for (; this.remove_redundant_wires(); )
            ;
    }
    ,
    n.prototype.remove_redundant_wires = function() {
        for (var a in this.connection_points)
            for (var b = this.connection_points[a], c = 0; c < b.length; c += 1) {
                var d = b[c]
                  , e = d.parent;
                if ("wire" == e.type())
                    for (var f = e.other_end(d), g = c + 1; g < b.length; g += 1) {
                        var h = b[g].parent;
                        if ("wire" == h.type() && h.other_end(d).coincident(f.x, f.y))
                            return u.prototype.remove.call(h),
                            !0
                    }
            }
        return !1
    }
    ,
    n.prototype.selections = function() {
        for (var a = !1, b = this.components.length - 1; b >= 0; b -= 1)
            this.components[b].selected && (a = !0);
        return a
    }
    ,
    n.prototype.compute_bbox = function(a, b, c) {
        if (0 == this.components.length)
            return [-16, -16, 16, 16];
        for (var d = void 0 === a ? 1 / 0 : a[0], e = void 0 === a ? -1 / 0 : a[2], f = void 0 === a ? 1 / 0 : a[1], g = void 0 === a ? -1 / 0 : a[3], h = this.components.length - 1; h >= 0; h -= 1) {
            var i = this.components[h];
            (!b || i.selected) && (c && i.selected || "property" != i.type() && (d = Math.min(i.bbox[0], d),
            e = Math.max(i.bbox[2], e),
            f = Math.min(i.bbox[1], f),
            g = Math.max(i.bbox[3], g)))
        }
        return [d, f, e, g]
    }
    ,
    n.prototype.unselected_bbox = function(a) {
        return this.compute_bbox(a, !1, !0)
    }
    ,
    n.prototype.selected_bbox = function(a) {
        return this.compute_bbox(a, !0, !1)
    }
    ,
    n.prototype.selected_grid = function() {
        for (var a = 1, b = this.components.length - 1; b >= 0; b -= 1) {
            var c = this.components[b];
            c.selected && (a = Math.max(a, c.required_grid))
        }
        return a
    }
    ;
    var A = [0, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 0, 7, 4, 5, 6, 2, 3, 0, 1, 6, 7, 4, 5, 3, 0, 1, 2, 5, 6, 7, 4, 4, 5, 6, 7, 0, 1, 2, 3, 5, 6, 7, 4, 3, 0, 1, 2, 6, 7, 4, 5, 2, 3, 0, 1, 7, 4, 5, 6, 1, 2, 3, 0]
      , B = {};
    u.prototype.required_grid = 8,
    u.prototype.type = function() {
        return this.module.get_name()
    }
    ,
    u.prototype.clone_properties = function(a) {
        var b = {};
        for (var c in this.properties) {
            var d = this.properties[c];
            void 0 === d || "" === d || !this.module.properties[c] || a && d == this.module.properties[c].value || (b[c] = d)
        }
        return b
    }
    ,
    u.prototype.set_property = function(a, b) {
        this.properties[a] = b,
        this.aspect && this.aspect.set_modified()
    }
    ,
    u.prototype.load = function(a) {
        this.module = j(a[0]),
        this.coords = a[1],
        this.properties = a[2] || {};
        var b = this;
        this.module.add_listener(function(a) {
            ("load" == a || "icon_changed" == a) && b.compute_bbox()
        }
        ),
        this.module.loaded && this.compute_bbox()
    }
    ,
    u.prototype.default_properties = function() {
        for (var a in this.module.properties)
            a in this.properties || (this.properties[a] = this.module.properties[a].value || "")
    }
    ,
    u.prototype.property_info = function(a) {
        return this.module.properties[a] || {}
    }
    ,
    u.prototype.compute_bbox = function() {
        if (this.default_properties(),
        this.name = this.properties.name,
        this.name && (this.name = this.name.toLowerCase()),
        this.module.has_aspect("icon")) {
            this.icon = this.module.aspect("icon");
            var a = this;
            this.aspect && $.each(this.connections, function(b, c) {
                a.aspect.remove_connection_point(c, c.location)
            }
            ),
            this.connections = [],
            this.icon.map_over_components(function(b) {
                var c = b.terminal_coords();
                c && a.add_connection(c[0], c[1], c[2])
            }
            ),
            this.bounding_box = this.icon.compute_bbox(),
            this.update_coords()
        }
    }
    ,
    u.prototype.terminal_coords = function() {
        return void 0
    }
    ,
    u.prototype.json = function() {
        var a = this.clone_properties(!0);
        return Object.keys(a).length > 0 ? [this.type(), this.coords.slice(0), a] : [this.type(), this.coords.slice(0)]
    }
    ,
    u.prototype.clone = function(a, b) {
        var c = t(this.json());
        return c.name = void 0,
        c.properties.name && (c.properties.name.value = ""),
        c.coords[0] = a,
        c.coords[1] = b,
        c
    }
    ,
    u.prototype.can_view = function() {
        return this.module && this.module.confidential && !this.module.confidential()
    }
    ,
    u.prototype.has_aspect = function(a) {
        return void 0 !== this.module ? this.module.has_aspect(a) : !1
    }
    ,
    u.prototype.set_select = function(a) {
        this.selected = a
    }
    ,
    u.prototype.add_connection = function(a, b, c) {
        var d = new v(this,a,b,c);
        return this.connections.push(d),
        d
    }
    ,
    u.prototype.update_coords = function() {
        var a = this.coords[0]
          , b = this.coords[1]
          , c = this.bounding_box;
        this.bbox[0] = this.transform_x(c[0], c[1]) + a,
        this.bbox[1] = this.transform_y(c[0], c[1]) + b,
        this.bbox[2] = this.transform_x(c[2], c[3]) + a,
        this.bbox[3] = this.transform_y(c[2], c[3]) + b,
        o(this.bbox);
        for (var d = this.connections.length - 1; d >= 0; d -= 1)
            this.connections[d].update_location()
    }
    ,
    u.prototype.inside = function(a, b, c) {
        return void 0 === c && (c = this.bbox),
        p(a, c[0], c[2]) && p(b, c[1], c[3])
    }
    ,
    u.prototype.rotate = function(a, b, c) {
        function d(a, b) {
            "undo" == b ? (m.coords[0] = e,
            m.coords[1] = f,
            m.coords[2] = g) : (m.coords[0] = j,
            m.coords[1] = k,
            m.coords[2] = l),
            m.update_coords()
        }
        var e = this.coords[0]
          , f = this.coords[1]
          , g = this.coords[2]
          , h = e - b
          , i = f - c
          , j = r(a, h, i) + b
          , k = s(a, h, i) + c
          , l = A[8 * g + a];
        this.coords[0] = j,
        this.coords[1] = k,
        this.coords[2] = l,
        this.update_coords();
        var m = this;
        this.aspect.add_change(d)
    }
    ,
    u.prototype.move_begin = function() {
        this.move_x = this.coords[0],
        this.move_y = this.coords[1],
        this.move_rotation = this.coords[2]
    }
    ,
    u.prototype.move = function(a, b) {
        this.coords[0] += a,
        this.coords[1] += b,
        this.update_coords()
    }
    ,
    u.prototype.move_end = function() {
        function a(a, e) {
            "undo" == e ? d.move(-b, -c) : d.move(b, c),
            d.aspect.check_wires(d)
        }
        var b = this.coords[0] - this.move_x
          , c = this.coords[1] - this.move_y;
        if (0 !== b || 0 !== c || this.coords[2] != this.move_rotation) {
            var d = this;
            this.aspect.add_change(a),
            this.aspect.check_wires(this)
        }
    }
    ,
    u.prototype.add = function(a) {
        function b(a, b) {
            "undo" == b ? c.remove() : c.add(a)
        }
        this.aspect = a,
        a.add_component(this),
        this.update_coords();
        var c = this;
        a.add_change(b)
    }
    ,
    u.prototype.remove = function() {
        function a(a, b) {
            "undo" == b ? d.add(a) : d.remove()
        }
        for (var b = this.connections.length - 1; b >= 0; b -= 1) {
            var c = this.connections[b];
            this.aspect.remove_connection_point(c, c.location)
        }
        this.aspect.remove_component(this);
        var d = this;
        this.aspect.add_change(a)
    }
    ,
    u.prototype.transform_x = function(a, b) {
        return r(this.coords[2], a, b)
    }
    ,
    u.prototype.transform_y = function(a, b) {
        return s(this.coords[2], a, b)
    }
    ,
    u.prototype.moveTo = function(a, b, c) {
        var d = this.transform_x(b, c) + this.coords[0]
          , e = this.transform_y(b, c) + this.coords[1];
        a.moveTo(d, e)
    }
    ,
    u.prototype.lineTo = function(a, b, c) {
        var d = this.transform_x(b, c) + this.coords[0]
          , e = this.transform_y(b, c) + this.coords[1];
        a.lineTo(d, e)
    }
    ;
    var C = {
        red: "rgb(255,64,64)",
        green: "rgb(64,255,64)",
        blue: "rgb(64,64,255)",
        cyan: "rgb(64,255,255)",
        magenta: "rgb(255,64,255)",
        yellow: "rgb(255,255,64)",
        black: "rgb(0,0,0)"
    };
    u.prototype.draw_line = function(a, b, c, d, e, f) {
        a.c.strokeStyle = this.selected ? a.selected_style : "wire" == this.type() ? a.show_grid ? a.normal_style : "rgb(0,0,0)" : C[this.properties.color] || (a.show_grid ? a.component_style : "rgb(0,0,0)");
        var g = this.transform_x(b, c) + this.coords[0]
          , h = this.transform_y(b, c) + this.coords[1]
          , i = this.transform_x(d, e) + this.coords[0]
          , j = this.transform_y(d, e) + this.coords[1];
        a.draw_line(g, h, i, j, f || 1)
    }
    ,
    u.prototype.draw_circle = function(a, b, c, d, e) {
        e ? a.c.fillStyle = this.selected ? a.selected_style : a.normal_style : a.c.strokeStyle = this.selected ? a.selected_style : "wire" == this.type() ? a.show_grid ? a.normal_style : "rgb(0,0,0)" : C[this.properties.color] || (a.show_grid ? a.component_style : "rgb(0,0,0)");
        var f = this.transform_x(b, c) + this.coords[0]
          , g = this.transform_y(b, c) + this.coords[1];
        a.draw_arc(f, g, d, 0, 2 * Math.PI, !1, 1, e)
    }
    ,
    u.prototype.draw_arc = function(a, b, c, d, e, f, g) {
        a.c.strokeStyle = this.selected ? a.selected_style : "wire" == this.type() ? a.normal_style : C[this.properties.color] || (a.show_grid ? a.component_style : "rgb(0,0,0)");
        var h = this.transform_x(b, c) + this.coords[0]
          , i = this.transform_y(b, c) + this.coords[1]
          , j = this.transform_x(d, e) + this.coords[0] - h
          , k = this.transform_y(d, e) + this.coords[1] - i
          , l = this.transform_x(f, g) + this.coords[0] - h
          , m = this.transform_y(f, g) + this.coords[1] - i
          , n = 2 * (j * m - k * l);
        if (0 === n)
            return void a.draw_line(h, i, j + h, k + i, 1);
        var o = j * j + k * k
          , p = l * l + m * m
          , q = (m * o - k * p) / n
          , r = (j * p - l * o) / n
          , s = Math.sqrt((j - q) * (j - q) + (k - r) * (k - r))
          , t = 2 * Math.PI - Math.atan2(-(0 - r), 0 - q)
          , u = 2 * Math.PI - Math.atan2(-(k - r), j - q)
          , v = 2 * Math.PI - Math.atan2(-(m - r), l - q)
          , w = u - t;
        0 > w && (w += 2 * Math.PI);
        var x = v - t;
        0 > x && (x += 2 * Math.PI);
        var y = x > w;
        a.draw_arc(q + h, r + i, s, t, u, y, 1, !1)
    }
    ;
    var D = [0, 1, 2, 3, 4, 5, 6, 7, 8, 2, 5, 8, 1, 4, 7, 0, 3, 6, 8, 7, 6, 5, 4, 3, 2, 1, 0, 6, 3, 0, 7, 4, 1, 8, 5, 3, 2, 1, 0, 5, 4, 3, 8, 7, 6, 8, 5, 2, 7, 4, 1, 6, 3, 0, 6, 7, 8, 3, 4, 5, 0, 1, 2, 0, 3, 6, 1, 4, 7, 2, 5, 8]
      , E = ["left", "center", "right", "left", "center", "right", "left", "center", "right"]
      , F = ["top", "top", "top", "middle", "middle", "middle", "bottom", "bottom", "bottom"];
    u.prototype.draw_text = function(a, b, c, d, e, f, g) {
        var h = D[9 * this.coords[2] + e];
        a.c.textAlign = E[h],
        a.c.textBaseline = F[h],
        a.c.fillStyle = void 0 === g ? this.selected ? a.selected_style : C[this.properties.color] || (a.show_grid ? a.component_style : "rgb(0,0,0)") : g,
        a.draw_text(b, this.transform_x(c, d) + this.coords[0], this.transform_y(c, d) + this.coords[1], f)
    }
    ,
    u.prototype.draw_text_important = function(a, b, c, d, e, f, g) {
        var h = D[9 * this.coords[2] + e];
        a.c.textAlign = E[h],
        a.c.textBaseline = F[h],
        a.c.fillStyle = void 0 === g ? this.selected ? a.selected_style : a.normal_style : g,
        a.draw_text_important(b, this.transform_x(c, d) + this.coords[0], this.transform_y(c, d) + this.coords[1], f)
    }
    ,
    u.prototype.draw = function(a) {
        if (void 0 === this.icon && this.compute_bbox(),
        this.icon && !this.icon.empty()) {
            var b = this;
            this.icon.map_over_components(function(c) {
                c.draw_icon(b, a)
            }
            )
        } else
            this.draw_text_important(a, this.type(), 0, 0, 4, a.annotation_font),
            this.draw_line(a, -16, -16, 16, -16, 1),
            this.draw_line(a, 16, -16, 16, 16, 1),
            this.draw_line(a, 16, 16, -16, 16, 1),
            this.draw_line(a, -16, 16, -16, -16, 1)
    }
    ,
    u.prototype.near = function(a, b) {
        return this.inside(a, b)
    }
    ,
    u.prototype.select = function(a, b, c) {
        return this.was_previously_selected = this.selected,
        this.near(a, b) ? (this.set_select(c ? !this.selected : !0),
        !0) : !1
    }
    ,
    u.prototype.select_rect = function(a) {
        q(this.bbox, a) && this.set_select(!0)
    }
    ,
    u.prototype.bisect = function() {}
    ,
    u.prototype.update_properties = function(a) {
        function b(b, e) {
            d.properties = "undo" == e ? c : a,
            this.compute_bbox()
        }
        if (void 0 !== a) {
            var c = this.clone_properties(!1);
            this.properties = a,
            this.compute_bbox();
            var d = this;
            this.aspect.add_change(b)
        }
    }
    ,
    u.prototype.validate_property = function() {
        return !1
    }
    ,
    u.prototype.edit_properties = function(b, c, d, e) {
        function f() {
            var c, d, h = p.clone_properties(), i = !1;
            for (var j in g) {
                var k = g[j].prop_input.value;
                "" == k && (k = g[j].prop_info.value),
                c = g[j].prop_info.type,
                d = $(".jade-pmsg", g[j]),
                d.text(""),
                "number" == c ? isNaN(a.utils.parse_number(k)) && (i = !0,
                d.text("not a valid number")) : "width" == c ? "" != k && isNaN(a.utils.parse_number(k)) && (i = !0,
                d.text("not a valid number")) : "name" == c ? a.utils.validate_name(k) || (i = !0,
                d.text("not a valid name")) : "signal" == c ? a.utils.validate_signal(k) || (i = !0,
                d.text("not a valid signal")) : "custom" == c && (p.validate_property(d, g[j].prop_name, k) || (i = !0)),
                h[g[j].prop_name] = k
            }
            i ? b.dialog("Edit Properties", o, f) : (p.name = h.name,
            b.aspect.start_action(),
            p.update_properties(h),
            b.aspect.end_action(),
            e && e(p),
            b.redraw_background())
        }
        if (this.near(c, d)) {
            var g = {};
            for (var h in this.properties) {
                var i = this.module.properties[h];
                if ("no" != i.edit) {
                    var j, k = i.label || h;
                    if ("menu" == i.type)
                        j = a.build_select(i.choices, this.properties[h]);
                    else {
                        var l = this.properties[h]
                          , m = "string" == i.type || "custom" == i.type ? "string" : "text";
                        j = a.build_input(m, Math.max(10, (void 0 === l ? 1 : l.length) + 5), this.properties[h])
                    }
                    var n = $("<span></span>").append(j).append('<span class="jade-pmsg"></span>')[0];
                    n.prop_input = j,
                    n.prop_name = h,
                    n.prop_info = this.property_info(h),
                    g[k] = n
                }
            }
            var o = a.build_table(g);
            $("tbody", o).prepend("<tr><td>Component:</td><td>" + this.module.get_name() + "<td></tr>");
            var p = this;
            return b.dialog("Edit Properties", o, f),
            !0
        }
        return !1
    }
    ;
    var G = 2;
    return v.prototype.nconnections = function() {
        var a = this.parent.aspect.connection_points[this.location];
        return a.length
    }
    ,
    v.prototype.update_location = function() {
        var a = this.location
          , b = this.parent
          , c = b.transform_x(this.offset_x, this.offset_y) + b.coords[0]
          , d = b.transform_y(this.offset_x, this.offset_y) + b.coords[1];
        this.x = c,
        this.y = d,
        this.location = c + "," + d,
        this.parent.aspect && this.parent.aspect.update_connection_point(this, a)
    }
    ,
    v.prototype.coincident = function(a, b) {
        return this.x == a && this.y == b
    }
    ,
    v.prototype.draw = function(a, b) {
        2 != b && this.parent.draw_circle(a, this.offset_x, this.offset_y, G, b > 2)
    }
    ,
    v.prototype.draw_x = function(a) {
        this.parent.draw_line(a, this.offset_x - 2, this.offset_y - 2, this.offset_x + 2, this.offset_y + 2, a.grid_style),
        this.parent.draw_line(a, this.offset_x + 2, this.offset_y - 2, this.offset_x - 2, this.offset_y + 2, a.grid_style)
    }
    ,
    {
        AUTOSAVE_TRIGGER: x,
        get_modules: b,
        clear_modules: c,
        load_modules: d,
        load_json: e,
        save_modules: g,
        clear_modified: h,
        set_clean: i,
        json_modules: f,
        find_module: j,
        remove_module: k,
        map_modules: l,
        Module: m,
        Aspect: n,
        Component: u,
        make_component: t,
        built_in_components: B,
        canonicalize: o,
        aOrient: D,
        ConnectionPoint: v,
        connection_point_radius: G
    }
}
,
jade_defs.netlist = function(a) {
    a.model.Aspect.prototype.netlist = function(a, b, c, d, e) {
        var f = this.module.get_name();
        if (-1 != e.indexOf(f))
            throw e.push(f),
            "Recursive inclusion of module:\n" + e.join(" \u2192 ");
        for (e.push(f),
        h = 0; h < this.components.length; h += 1)
            this.components[h].set_select(!1),
            this.components[h].compute_bbox();
        this.label_connection_points(b, c, d),
        this.ensure_component_names(c);
        for (var g = [], h = 0; h < this.components.length; h += 1) {
            try {
                f = this.components[h].netlist(a, b, c, e)
            } catch (i) {
                throw this.components[h].set_select(!0),
                i
            }
            void 0 !== f && g.push.apply(g, f)
        }
        return e.pop(),
        g
    }
    ,
    a.model.Aspect.prototype.label_connection_points = function(a, b, c) {
        var d;
        for ($.each(this.connection_points, function(a, b) {
            $.each(b, function(a, b) {
                b.clear_label()
            }
            )
        }
        ),
        d = this.components.length - 1; d >= 0; d -= 1)
            this.components[d].propagate_width();
        for (d = this.components.length - 1; d >= 0; d -= 1)
            this.components[d].add_default_labels(a, b, c);
        for (this.next_label = 0,
        d = this.components.length - 1; d >= 0; d -= 1)
            this.components[d].label_connections(b)
    }
    ,
    a.model.Aspect.prototype.get_next_label = function(a) {
        return this.next_label += 1,
        a + this.next_label.toString()
    }
    ,
    a.model.Aspect.prototype.propagate_select = function(a) {
        for (var b = this.connection_points[a.location], c = b.length - 1; c >= 0; c -= 1)
            b[c].propagate_select()
    }
    ,
    a.model.Aspect.prototype.propagate_label = function(a, b) {
        for (var c = this.connection_points[b], d = c.length - 1; d >= 0; d -= 1)
            c[d].propagate_label(a)
    }
    ,
    a.model.Aspect.prototype.propagate_width = function(a, b) {
        for (var c = this.connection_points[b], d = c.length - 1; d >= 0; d -= 1)
            c[d].propagate_width(a)
    }
    ,
    a.model.Aspect.prototype.ensure_component_names = function(a) {
        function b(a) {
            var b = (g[a] || 0) + 1;
            return g[a] = b,
            a + "_" + b.toString()
        }
        var c, d, e, f = {};
        for (c = 0; c < this.components.length; c += 1)
            if (d = this.components[c],
            e = d.name) {
                if (e in f)
                    throw d.selected = !0,
                    "Duplicate component name: " + a + e;
                f[e] = d
            }
        var g = {};
        for (c = 0; c < this.components.length; c += 1)
            if (d = this.components[c],
            void 0 !== d.module.name && (e = d.name,
            "" == e || void 0 === e)) {
                var h = d.module.name.toLowerCase().split("/").pop();
                do
                    e = b(h);
                while (e in f);d.name = e,
                f[e] = d
            }
    }
    ,
    a.model.Component.prototype.propagate_select = function() {}
    ,
    a.model.Component.prototype.propagate_label = function() {}
    ,
    a.model.Component.prototype.propagate_width = function() {}
    ,
    a.model.Component.prototype.label_connections = function(a) {
        for (var b = this.connections.length - 1; b >= 0; b -= 1) {
            var c = this.connections[b];
            if (!c.label) {
                for (var d = c.width || c.nlist.length, e = [], f = 0; d > f; f += 1)
                    e.push(this.aspect.get_next_label(a));
                c.propagate_label(e)
            }
        }
    }
    ,
    a.model.Component.prototype.add_default_labels = function(b, c, d) {
        var e, f;
        if (this.properties.global_signal) {
            if (e = a.utils.parse_signal(this.properties.global_signal),
            -1 == b.indexOf(this.properties.global_signal) && b.push(this.properties.global_signal),
            this.connections[0].width > 1 && 1 == e.length)
                for (; this.connections[0].width > e.length; )
                    e.push(e[0])
        } else if (e = a.utils.parse_signal(this.properties.signal),
        e.length > 0)
            for (f = 0; f < e.length; f += 1) {
                var g = e[f];
                e[f] = g in d ? d[g] : -1 != b.indexOf(g) ? g : c + g
            }
        if (e.length > 0)
            for (f = 0; f < this.connections.length; f += 1)
                this.connections[f].propagate_label(e)
    }
    ,
    a.model.Component.prototype.netlist = function(a, b, c, d) {
        var e, f = [], g = 1;
        for (e = 0; e < this.connections.length; e += 1) {
            var h = this.connections[e]
              , i = h.label.length
              , j = h.nlist.length;
            if (i % j !== 0)
                throw this.selected = !0,
                "Number of connections (" + i + ") for terminal " + h.name + " of " + c + this.name + " not a multiple of " + j;
            g = Math.max(g, i / j),
            f.push([h.nlist, h.label])
        }
        for (e = 0; e < this.connections.length; e += 1) {
            var h = this.connections[e]
              , k = h.label.length
              , l = g * h.nlist.length;
            if (l % k !== 0)
                throw this.selected = !0,
                "Number of signals needed (" + l + ") for terminal " + h.name + " of " + c + this.name + " not multiple of " + k
        }
        var m = [];
        for (e = 0; g > e; e += 1) {
            for (var n = {}, o = 0; o < f.length; o += 1)
                for (var p = f[o][0], q = p.length, r = f[o][1], s = r.length / q, t = 0; q > t; t += 1)
                    n[p[t]] = r[e % s + t * s];
            if (-1 != a.indexOf(this.type())) {
                var u = this.clone_properties(!1);
                void 0 !== this.name && (u.name = c + this.name.toLowerCase(),
                g > 1 && (u.name += "[" + (g - 1 - e).toString() + "]")),
                m.push([this.type(), n, u])
            } else {
                if (!this.has_aspect("schematic"))
                    throw this.selected = !0,
                    "No schematic for " + c + this.properties.name + " an instance of " + this.type();
                var v = this.module.aspect("schematic");
                if (void 0 !== this.name) {
                    var w = c + this.name.toLowerCase();
                    g > 1 && (w += "[" + (g - 1 - e).toString() + "]"),
                    w += "."
                }
                var x = v.netlist(a, b, w, n, d);
                m.push.apply(m, x)
            }
        }
        return m
    }
    ,
    a.model.ConnectionPoint.prototype.clear_label = function() {
        this.label = void 0,
        this.width = void 0,
        this.selected = !1
    }
    ,
    a.model.ConnectionPoint.prototype.propagate_select = function() {
        this.selected || (this.selected = !0,
        this.parent.aspect.propagate_select(this),
        this.parent.propagate_select())
    }
    ,
    a.model.ConnectionPoint.prototype.propagate_label = function(b) {
        if (this.width && this.width != b.length)
            throw this.parent.aspect.propagate_select(this),
            "Node label [" + b + "] incompatible with specified width " + this.width.toString();
        if (void 0 === this.label)
            this.label = b,
            this.parent.aspect.propagate_label(b, this.location),
            this.parent.propagate_label(b);
        else if (!a.utils.signal_equals(this.label, b))
            throw this.parent.aspect.propagate_select(this),
            "Node has two conflicting sets of labels: [" + this.label.join(", ") + "], [" + b.join(", ") + "]"
    }
    ,
    a.model.ConnectionPoint.prototype.propagate_width = function(a) {
        if (void 0 === this.width)
            this.width = a,
            this.parent.aspect.propagate_width(a, this.location),
            this.parent.propagate_width(a);
        else if (this.width != a)
            throw this.parent.aspect.propagate_select(this),
            "Node has two conflicting widths: " + this.width + ", " + a
    }
    ,
    a.netlist = {},
    a.netlist.extract_nodes = function(a) {
        var b = {};
        return $.each(a, function(a, c) {
            if ("ground" != c.type)
                for (var d in c.connections)
                    b[c.connections[d].toLowerCase()] = null ;
            else
                b[c.connections[0].toLowerCase()] = null 
        }
        ),
        Object.keys(b)
    }
    ,
    a.netlist.print_netlist = function(a) {
        if (a.length > 0) {
            var b = [];
            $.each(a, function(a, c) {
                b.push(c.type + " (" + c.properties.name + "): " + JSON.stringify(c.connections) + " " + JSON.stringify(c.properties))
            }
            ),
            console.log(b.join("\n")),
            console.log(b.length.toString() + " devices")
        }
    }
    ,
    a.netlistparse_source = function(b) {
        var c = b.match(/(\w+)\s*\((.*?)\)\s*/)
          , d = $.map(c[2].split(","), a.utils.parse_number);
        return {
            type: c[1],
            args: d
        }
    }
}
,
jade_defs.icons = function(a) {
    a.icons = {},
    a.icons.grid_icon = '<span class="fa fa-fw fa-th"></span>',
    a.icons.actions_icon = '<span class="fa fa-file-o"></span>',
    a.icons.close_icon = '<span class="fa fa-times fa-inverse"></span>',
    a.icons.resize_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 10 13.5 l 3 -3 m 0 -3 l -6 6 m -3 0 l 9 -9" stroke="black" stroke-width="0.5"/></svg>',
    a.icons.undo_icon = '<span class="fa fa-fw fa-reply"></span>',
    a.icons.redo_icon = '<span class="fa fa-fw fa-share"></span>',
    a.icons.cut_icon = '<span class="fa fa-fw fa-cut"></span>',
    a.icons.copy_icon = '<span class="fa fa-fw fa-copy"></span>',
    a.icons.paste_icon = '<span class="fa fa-fw fa-paste"></span>',
    a.icons.fliph_icon = '<span class="fa fa-fw fa-arrows-h"></span>',
    a.icons.flipv_icon = '<span class="fa fa-fw fa-arrows-v"></span>',
    a.icons.rotcw_icon = '<span class="fa fa-fw fa-rotate-right"></span>',
    a.icons.rotccw_icon = '<span class="fa fa-fw fa-rotate-left"></span>',
    a.icons.up_icon = '<span class="fa fa-fw fa-level-up"></span>',
    a.icons.down_icon = '<span class="fa fa-fw fa-level-down"></span>',
    a.icons.ground_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 8.5 3.5 v 7 h -5 l 5 5 l 5 -5 h -5" stroke="black" fill="transparent"/></svg>',
    a.icons.vdd_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 8.5 5.5 v 8 M 3.5 5.5 h 10" stroke="black" fill="transparent"/></svg>',
    a.icons.port_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 1.5 6.5 h 7 l 4 4 l -4 4 h -7 v -8 m 11 4 h 5" stroke="black" fill="transparent"/></svg>',
    a.icons.jumper_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 4 12 C 4 6, 12 6, 12 12" stroke="black" fill="transparent"/><circle cx="4" cy="12" r="1" stroke="black"/><circle cx="12" cy="12" r="1" stroke="black"/></svg>',
    a.icons.text_icon = '<span class="fa fa-fw fa-font"></span>',
    a.icons.check_icon = '<span class="fa fa-fw fa-check" style="color:green;"></span>',
    a.icons.select_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 3.5 3.5 v 9 l 2 -2 l 2 5 l 3 -2 l -2 -4 l 2.5 -0.5 L 3.5 3.5" fill="black"/></svg>',
    a.icons.line_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 3.5 5.5 l 10 10" stroke="black" fill="transparent"/></svg>',
    a.icons.arc_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><path d="M 3.5 5.5 c 8 0, 10 8, 10 10" stroke="black" fill="transparent"/></svg>',
    a.icons.circle_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="10" r="5" stroke="black" fill="transparent"/></svg>',
    a.icons.property_icon = "<span>{P}</span>",
    a.icons.terminal_icon = '<svg width="16" height="16" viewBox="0 0 16 16"><circle cx="5" cy="10" r="3" stroke="black" fill="transparent"/><path d="M 5 10 h 8" stroke="black" fill="transparent"/></svg>',
    a.icons.dc_icon = '<span style="position: relative; top: 4px;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 2 2 h 12" stroke="black" stroke-width="1.5"/><path d="M 2 12 h 12" stroke="black" stroke-dasharray="2,1"/></svg></span>',
    a.icons.sweep_icon = '<span style="position: relative; top: 2px;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 0 14 h 16" stroke="black" stroke-width=".75"/><path d="M 0 14 L 6 10 16 9" stroke="black" stroke-width=".75" fill="none"/><path d="M 0 14 L 5 8 8 6 16 4" stroke="black" stroke-width=".75" fill="none"/><path d="M 0 14 L 4 6 6 4 8 2 16 0" stroke="black" stroke-width=".75" fill="none"/></svg></span>',
    a.icons.ac_icon = '<span style="position: relative; top: 2px;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 0 8 T 3 2 8 8 13 14 16 8" stroke="black" stroke-width="1.5" fill="none"/></svg></span>',
    a.icons.tran_icon = '<span style="position: relative; top: 2px;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 12 0 v 4 h -4 v 8 h 4 v 4" stroke="black" fill="none"/><path d="M 5 4 v 8 M 5 8 h -4" stroke="black" fill="none"/></svg></span>',
    a.icons.gate_icon = '<span style="position: relative; top: 2px;"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M 0 4 h 6 M 0 12 h 6 M 6 2 v 12 M 12 8 h 4 M 6 2 C 6 2 12 0 12 8 M 6 14 C 6 15 12 14 12 8" stroke="black" fill="none"/></svg></span>',
    a.icons.timing_icon = '<span class="fa fa-fw fa-lg fa-clock-o"></span>',
    a.icons.edit_module_icon = '<span class="fa fa-fw fa-lg fa-pencil-square-o fa-lg"></span>',
    a.icons.copy_module_icon = '<span class="fa fa-fw fa-lg fa-copy fa-lg"></span>',
    a.icons.delete_module_icon = '<span class="fa fa-fw fa-lg fa-trash-o fa-lg"></span>',
    a.icons.readonly = '<i class="fa fa-ban" style="color:red;"></i>',
    a.icons.download_icon = '<span class="fa fa-fw fa-lg fa-download"></span>',
    a.icons.upload_icon = '<span class="fa fa-fw fa-lg fa-upload"></span>',
    a.icons.recycle_icon = '<span class="fa fa-fw fa-lg fa-recycle"></span>',
    a.icons.mail_icon = '<span class="fa fa-fw fa-lg fa-envelope-o"></span>'
}
,
jade_defs.schematic_view = function(a) {
    function b(m, n) {
        function o(a) {
            return a.aspect && !a.aspect.read_only() && a.aspect.selections()
        }
        function p() {
            return this.diagram && this.diagram.aspect && !this.diagram.aspect.read_only()
        }
        this.jade = n,
        this.status = n.status,
        this.tab = m.tab;
        var q = {};
        if (this.options = q,
        n.configuration.options && $.each(n.configuration.options, function(b, c) {
            var d = a.utils.parse_number(c);
            isNaN(d) || (q[b] = d)
        }
        ),
        this.diagram = new a.Diagram(this,"jade-schematic-diagram"),
        m.diagram = this.diagram,
        this.diagram.wire = void 0,
        this.diagram.new_part = void 0,
        this.diagram.grid = 8,
        this.diagram.zoom_factor = 1.25,
        this.diagram.zoom_min = Math.pow(this.diagram.zoom_factor, -3),
        this.diagram.zoom_max = Math.pow(this.diagram.zoom_factor, 9),
        this.diagram.origin_min = -200,
        this.diagram.origin_max = 200,
        this.hierarchy_stack = [],
        $(this.diagram.canvas).mousemove(j).mouseover(g).mouseout(h).mouseup(k).mousedown(i).dblclick(l).keydown(f),
        this.toolbar = new a.Toolbar(this.diagram),
        !n.configuration.readonly) {
            this.toolbar.add_tool("grid", a.icons.grid_icon, "Toggle schematic grid", a.diagram_toggle_grid),
            this.toolbar.add_spacer(),
            this.toolbar.add_tool("undo", a.icons.undo_icon, "Undo: undo effect of previous action (\u2318Z, ctrl-Z)", a.diagram_undo, function(a) {
                return a.aspect && a.aspect.can_undo()
            }
            ),
            this.toolbar.add_tool("redo", a.icons.redo_icon, "redo: redo effect of next action (\u2318Y, ctrl-Y)", a.diagram_redo, function(a) {
                return a.aspect && a.aspect.can_redo()
            }
            ),
            this.toolbar.add_tool("cut", a.icons.cut_icon, "Cut: move selected components from diagram to the clipboard (\u2318X, ctrl-X)", a.diagram_cut, o),
            this.toolbar.add_tool("copy", a.icons.copy_icon, "Copy: copy selected components into the clipboard (\u2318C, ctrl-C)", a.diagram_copy, o),
            this.toolbar.add_tool("paste", a.icons.paste_icon, "Paste: copy clipboard into the diagram (\u2318V, ctrl-V)", a.diagram_paste, function(b) {
                return b.aspect && !b.aspect.read_only() && a.clipboards[b.editor.editor_name].length > 0
            }
            ),
            this.toolbar.add_tool("fliph", a.icons.fliph_icon, "Flip Horizontally: flip selection horizontally", a.diagram_fliph, o),
            this.toolbar.add_tool("flipv", a.icons.flipv_icon, "Flip Vertically: flip selection vertically", a.diagram_flipv, o),
            this.toolbar.add_tool("rotcw", a.icons.rotcw_icon, "Rotate Clockwise: rotate selection clockwise", a.diagram_rotcw, o),
            this.toolbar.add_tool("rotccw", a.icons.rotccw_icon, "Rotate Counterclockwise: rotate selection counterclockwise", a.diagram_rotccw, o),
            this.toolbar.add_spacer(),
            this.hierarchy = n.configuration.hierarchical,
            this.hierarchy && (this.toolbar.add_tool("down", a.icons.down_icon, "Down in the hierarchy: view selected included module", d, function(a) {
                if (!a.aspect)
                    return !1;
                var c = a.aspect.selected_component();
                return void 0 !== c ? c.has_aspect(b.prototype.editor_name) && c.can_view() : !1
            }
            ),
            this.toolbar.add_tool("up", a.icons.up_icon, "Up in the hierarchy: return to including module", e, function(a) {
                return a.editor && a.editor.hierarchy_stack.length > 0
            }
            ),
            this.toolbar.add_spacer());
            var r = this.toolbar.add_tool("ground", a.icons.ground_icon, "Ground connection: click and drag to insert", null , p);
            c(r, this, "ground"),
            r = this.toolbar.add_tool("vdd", a.icons.vdd_icon, "Power supply connection: click and drag to insert", null , p),
            c(r, this, "vdd"),
            r = this.toolbar.add_tool("port", a.icons.port_icon, "I/O Port: click and drag to insert", null , p),
            c(r, this, "port"),
            r = this.toolbar.add_tool("jumper", a.icons.jumper_icon, "Jumper for connecting wires with different names: click and drag to insert", null , p),
            c(r, this, "jumper"),
            this.memory_part = this.toolbar.add_tool("memory", "<span>MEM</span>", "Multi-port memory: click and drag to insert", null , p),
            c(this.memory_part, this, "memory"),
            this.memory_part.hide(),
            r = this.toolbar.add_tool("text", a.icons.text_icon, "Text: click and drag to insert", null , p),
            c(r, this, "text"),
            this.toolbar.add_spacer()
        }
        for (var s = n.configuration.tools || [], t = 0; t < B.length; t += 1) {
            var v = B[t];
            s.length > 0 && -1 == s.indexOf(v[0]) || this.toolbar.add_tool(v[0], v[1], v[2], v[3], v[4])
        }
        m.appendChild(this.toolbar.toolbar[0]),
        m.appendChild(this.diagram.canvas);
        var w = new a.model.Aspect("untitled",null );
        if (this.diagram.set_aspect(w),
        !n.configuration.readonly) {
            this.parts_bin = new u(this,n.configuration.parts),
            m.appendChild(this.parts_bin.top_level),
            this.resizer = $('<div class="jade-xparts-resize"></div>');
            var x, y, z = this;
            this.resizer.on("mousedown", function(a) {
                function b(a) {
                    var b, c = window.event || a, d = c.pageX - x, e = $(z.parts_bin.top_level), f = $(z.diagram.canvas);
                    return d >= 0 ? (b = e.width() - d,
                    75 > b && (d -= 75 - b)) : (b = f.width() + d,
                    300 > b && (d += 300 - b)),
                    e.width(e.width() - d),
                    z.resize($(m).width(), $(m).height(), !0),
                    x = c.pageX,
                    y = c.pageY,
                    !1
                }
                function c() {
                    var a = $(document).get(0);
                    return a.removeEventListener("mousemove", b, !0),
                    a.removeEventListener("mouseup", c, !0),
                    !1
                }
                return x = a.pageX,
                y = a.pageY,
                $(document).get(0).addEventListener("mousemove", b, !0),
                $(document).get(0).addEventListener("mouseup", c, !0),
                !1
            }
            ),
            m.appendChild(this.resizer[0])
        }
    }
    function c(b, c, d) {
        b.off("click");
        var e = new v(c);
        e.set_component(a.model.make_component([d, [0, 0, 0], {}])),
        b.mousedown(function(a) {
            c.diagram.new_part = e,
            a.originalEvent.preventDefault()
        }
        ),
        b.mouseup(function(a) {
            c.diagram.new_part = void 0,
            a.originalEvent.preventDefault()
        }
        ),
        b.click(function(a) {
            a.originalEvent.preventDefault()
        }
        )
    }
    function d(a) {
        var c = a.aspect.selected_component();
        if (void 0 !== c && c.can_view() && c.has_aspect(b.prototype.editor_name)) {
            var d = a.editor;
            d.hierarchy_stack.push(a.aspect.module),
            d.jade.edit(c.module)
        }
    }
    function e(a) {
        var b = a.editor;
        b.hierarchy_stack.length > 0 && b.jade.edit(b.hierarchy_stack.pop())
    }
    function f(a) {
        var b = a.target.diagram
          , c = a.keyCode;
        if (38 == c)
            e(b);
        else if (40 == c)
            d(b);
        else if (b.key_down(a))
            return !0;
        return a.preventDefault(),
        !1
    }
    function g(a) {
        var b = a.target.diagram;
        if (!b.aspect.read_only() && b.new_part) {
            var c = b.new_part;
            b.new_part = void 0,
            c.select(!1),
            b.unselect_all(-1),
            b.redraw_background(),
            b.aspect.start_action(),
            b.set_cursor_grid(c.component.required_grid),
            b.event_coords(a),
            c = c.component.clone(b.cursor_x, b.cursor_y),
            c.add(b.aspect),
            c.set_select(!0),
            b.drag_begin()
        }
        return b.redraw(),
        b.canvas.focus(),
        !1
    }
    function h(a) {
        var b = a.target.diagram;
        return b.redraw(),
        !1
    }
    function i(b) {
        var c = b.target.diagram;
        if (c.event_coords(b),
        c.pan_zoom())
            return !1;
        var d = Math.abs(c.aspect_x - c.cursor_x)
          , e = Math.abs(c.aspect_y - c.cursor_y)
          , f = c.aspect.connection_points[c.cursor_x + "," + c.cursor_y];
        return !c.aspect.read_only() && d <= a.model.connection_point_radius && e <= a.model.connection_point_radius && f && !b.shiftKey ? (c.unselect_all(-1),
        c.redraw_background(),
        c.wire = [c.cursor_x, c.cursor_y, c.cursor_x, c.cursor_y]) : c.start_select(b.shiftKey),
        b.preventDefault(),
        !1
    }
    function j(a) {
        var b = a.target.diagram;
        return b.event_coords(a),
        b.wire ? (b.wire[2] = b.cursor_x,
        b.wire[3] = b.cursor_y,
        b.redraw()) : b.mouse_move(),
        a.preventDefault(),
        !1
    }
    function k(a) {
        var b = a.target.diagram;
        if (b.wire) {
            var c = b.wire;
            if (b.wire = void 0,
            c[0] != c[2] || c[1] != c[3]) {
                b.aspect.start_action();
                var d = b.aspect.add_wire(c[0], c[1], c[2], c[3], 0);
                d.selected = !0,
                b.aspect.end_action(),
                b.redraw_background()
            } else
                b.redraw()
        } else
            b.mouse_up(a.shiftKey);
        return a.preventDefault(),
        !1
    }
    function l(a) {
        var b = a.target.diagram;
        return b.event_coords(a),
        b.aspect && !b.aspect.read_only() && b.aspect.map_over_components(function(a) {
            return a.edit_properties(b, b.aspect_x, b.aspect_y) ? !0 : !1
        }
        ),
        a.preventDefault(),
        !1
    }
    function m(b) {
        a.model.Component.call(this),
        this.module = C,
        this.load(b)
    }
    function n(b) {
        a.model.Component.call(this),
        this.module = E,
        this.load(b)
    }
    function o(b) {
        a.model.Component.call(this),
        this.module = F,
        this.load(b)
    }
    function p(b) {
        a.model.Component.call(this),
        this.module = G,
        this.load(b)
    }
    function q(b) {
        a.model.Component.call(this),
        this.module = H,
        this.load(b)
    }
    function r(a, b, c) {
        var d = J[0].getContext("2d");
        c && (J.css("font", c),
        d.font = c);
        var e = d.measureText(a).width
          , f = J.css("font-size").match(/([\d\.]*)(\w*)/)
          , g = parseFloat(f[1]);
        "em" == f[2] ? g *= 16 : "pt" == f[2] && (g *= 4 / 3);
        var h = [0, 0, 0, 0]
          , i = b.split("-")
          , j = i[0];
        "top" == j ? (h[1] = 0,
        h[3] = g) : "center" == j ? (h[1] = -g / 2,
        h[3] = g / 2) : (h[1] = -g,
        h[3] = 0);
        var k = i[1] || i[0];
        return "left" == k ? (h[0] = 0,
        h[2] = e) : "center" == k ? (h[0] = -e / 2,
        h[2] = e / 2) : (h[0] = -e,
        h[2] = 0),
        h
    }
    function s(b) {
        a.model.Component.call(this),
        this.module = K,
        this.load(b)
    }
    function t(b) {
        a.model.Component.call(this),
        this.module = L,
        this.load(b)
    }
    function u(a, b) {
        this.editor = a,
        this.diagram = a.diagram,
        this.components = a.components,
        this.parts_wanted = b;
        var c = $('<div class="jade-xparts-bin"></div>');
        this.top_level = c[0],
        this.top_level.parts_bin = this,
        this.parts = {}
    }
    function v(a) {
        this.editor = a,
        this.diagram = a.diagram,
        this.component = void 0,
        this.selected = !1,
        this.canvas = $('<canvas class="jade-xpart"></div>'),
        this.canvas[0].part = this;
        {
            var b = this.canvas[0].getContext("2d");
            window.devicePixelRatio || 1,
            b.webkitBackingStorePixelRatio || b.mozBackingStorePixelRatio || b.msBackingStorePixelRatio || b.oBackingStorePixelRatio || b.backingStorePixelRatio || 1
        }
        this.pixelRatio = 1,
        this.canvas[0].width = M * this.pixelRatio,
        this.canvas[0].height = N * this.pixelRatio,
        b.scale(this.pixelRatio, this.pixelRatio),
        this.property_font = "5pt sans-serif",
        this.annotation_font = "6pt sans-serif"
    }
    function w(a) {
        var b = a.target.part
          , c = b.component.module.properties.tool_tip;
        return c = void 0 !== c ? c.value : b.component.type(),
        c += ": drag onto diagram to insert",
        b.can_edit && (c += ", double click to edit"),
        b.diagram.message(c),
        !1
    }
    function x(a) {
        var b = a.target.part;
        return b.diagram.message(""),
        !1
    }
    function y(a) {
        var b = a.target.part;
        return b.select(!0),
        b.diagram.new_part = b,
        a.originalEvent.preventDefault(),
        !1
    }
    function z(a) {
        var b = a.target.part;
        return b.select(!1),
        b.diagram.new_part = void 0,
        !1
    }
    function A(a) {
        var b = a.target.part;
        return b.editor.jade.edit(b.component.module.get_name()),
        a.preventDefault(),
        !1
    }
    var B = [];
    b.prototype.diagram_changed = function(a) {
        var b = a.aspect.module;
        if (b) {
            var c = this.jade.configuration.tests;
            delete c[b.get_name()]
        }
    }
    ,
    b.prototype.resize = function(a, b, c) {
        var d = $(this.diagram.canvas)
          , e = d.outerWidth(!0) - d.width()
          , f = d.outerHeight(!0) - d.height()
          , g = this.parts_bin ? this.resizer.outerWidth(!0) + 1 + $(this.parts_bin.top_level).outerWidth(!0) : 0
          , h = this.toolbar.toolbar.outerHeight(!0)
          , i = a - e
          , j = b - f - h;
        d.width(i - g),
        d.height(j),
        this.parts_bin && (d = this.resizer,
        d.height(j),
        this.parts_bin.resize(i, j, c)),
        c && this.diagram.resize()
    }
    ,
    b.prototype.show = function() {
        this.diagram.resize(),
        this.parts_bin && this.parts_bin.show()
    }
    ,
    b.prototype.set_aspect = function(c) {
        var d = c.aspect(b.prototype.editor_name);
        $(this.tab).html(b.prototype.editor_name),
        d.read_only() && $(this.tab).append(" " + a.icons.readonly),
        this.diagram.set_aspect(d),
        this.parts_bin && this.parts_bin.show()
    }
    ,
    b.prototype.redraw = function(a) {
        this.toolbar && this.toolbar.enable_tools(this.diagram);
        var b = a.wire;
        b && (a.c.strokeStyle = a.selected_style,
        a.draw_line(b[0], b[1], b[2], b[3], 1))
    }
    ,
    b.prototype.editor_name = "schematic",
    a.editors.push(b),
    m.prototype = new a.model.Component,
    m.prototype.constructor = m,
    m.prototype.type = function() {
        return "wire"
    }
    ,
    a.model.built_in_components.wire = m;
    var C = {
        get_name: function() {
            return "wire"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            signal: {
                type: "signal",
                label: "Signal name",
                value: "",
                edit: "yes"
            },
            width: {
                type: "width",
                label: "Bus width",
                value: "",
                edit: "yes"
            }
        }
    }
      , D = 2;
    m.prototype.load = function(b) {
        this.coords = b[1],
        this.properties = b[2] || {},
        this.default_properties();
        var c = this.coords[3]
          , d = this.coords[4];
        this.add_connection(0, 0),
        this.add_connection(c, d);
        var e = [0, 0, c, d];
        a.model.canonicalize(e),
        e[0] -= D,
        e[1] -= D,
        e[2] += D,
        e[3] += D,
        this.bounding_box = e,
        this.update_coords(),
        this.len = Math.sqrt(c * c + d * d)
    }
    ,
    m.prototype.other_end = function(a) {
        return this.connections[0].coincident(a.x, a.y) ? this.connections[1] : this.connections[1].coincident(a.x, a.y) ? this.connections[0] : void 0
    }
    ,
    m.prototype.far_end = function() {
        var a = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0]
          , b = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        return [a, b]
    }
    ,
    m.prototype.move_end = function() {
        a.model.Component.prototype.move_end.call(this),
        this.aspect.check_connection_points(this)
    }
    ,
    m.prototype.add = function(b) {
        a.model.Component.prototype.add.call(this, b),
        this.aspect.check_wires(this),
        this.aspect.check_connection_points(this)
    }
    ,
    m.prototype.remove = function() {
        for (var b = this.connections[0], c = this.connections[1], d = this.aspect.find_connections(b), e = 0; e < d.length; e += 1) {
            var f = d[e].parent;
            if ("wire" == f.type() && f.other_end(b).coincident(c.x, c.y)) {
                a.model.Component.prototype.remove.call(f);
                break
            }
        }
    }
    ,
    m.prototype.draw = function(a) {
        var b = this.coords[3]
          , c = this.coords[4];
        this.draw_line(a, 0, 0, b, c);
        var d = this.properties.width;
        if (d && d > 1) {
            var e = b / 2
              , f = c / 2;
            if (0 == c)
                b = 0,
                c = 2;
            else if (0 == b)
                b = 2,
                c = 0;
            else {
                var g = Math.atan2(-b, c);
                b = 2 * Math.cos(g),
                c = 2 * Math.sin(g)
            }
            0 > b && (b = -b,
            c = -c),
            this.draw_line(a, e - b, f - c, e + b, f + c, .5);
            var h = Math.abs(c) > b ? 0 > c ? 7 : 1 : 3;
            this.draw_text(a, d.toString(), e + b, f + c, h, "3pt sans-serif"),
            b = this.coords[3],
            c = this.coords[4]
        }
        var h, i = this.properties.signal;
        if (void 0 !== i) {
            var j = 1 == this.connections[0].nconnections()
              , k = 1 == this.connections[1].nconnections();
            if (j && !k || !j && k) {
                var l = this.connections[j ? 0 : 1]
                  , m = l.offset_x
                  , n = l.offset_y;
                if (0 === b || Math.abs(c / b) > 1) {
                    var o = (this.bounding_box[1] + this.bounding_box[3]) / 2;
                    l.offset_y > o ? (h = 1,
                    n += 3) : (h = 7,
                    n -= 3)
                } else {
                    var p = (this.bounding_box[0] + this.bounding_box[2]) / 2;
                    l.offset_x > p ? (h = 3,
                    m += 3) : (h = 5,
                    m -= 3)
                }
                this.draw_text(a, i, m, n, h, a.property_font)
            } else
                0 === b ? (h = 3,
                b += 4) : 0 === c ? (h = 7,
                c -= 4) : h = c / b > 0 ? 6 : 8,
                this.draw_text(a, i, b >> 1, c >> 1, h, a.property_font)
        }
    }
    ,
    m.prototype.draw_icon = function(a, b) {
        var c = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0]
          , d = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        a.draw_line(b, this.coords[0], this.coords[1], c, d)
    }
    ,
    m.prototype.distance = function(a, b) {
        var c = this.transform_x(this.coords[3], this.coords[4])
          , d = this.transform_y(this.coords[3], this.coords[4])
          , e = Math.abs((a - this.coords[0]) * d - (b - this.coords[1]) * c) / this.len;
        return e
    }
    ,
    m.prototype.near = function(a, b) {
        return this.inside(a, b) && this.distance(a, b) <= D ? !0 : !1
    }
    ,
    m.prototype.select_rect = function(a) {
        this.was_previously_selected = this.selected;
        var b = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0]
          , c = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        (this.inside(this.coords[0], this.coords[1], a) || this.inside(b, c, a)) && this.set_select(!0)
    }
    ,
    m.prototype.bisect_cp = function(a) {
        var b = a.x
          , c = a.y;
        return this.inside(b, c) && this.distance(b, c) < 1 && !this.connections[0].coincident(b, c) && !this.connections[1].coincident(b, c) ? !0 : !1
    }
    ,
    m.prototype.bisect = function(a) {
        if (void 0 === a)
            return null ;
        for (var b = a.connections.length - 1; b >= 0; b -= 1) {
            var c = a.connections[b];
            if (this.bisect_cp(c))
                return c
        }
        return null 
    }
    ,
    m.prototype.propagate_select = function() {
        this.selected || (this.selected = !0,
        this.connections[0].propagate_select(),
        this.connections[1].propagate_select())
    }
    ,
    m.prototype.propagate_width = function(a) {
        var b = this.properties.width;
        if (b)
            if (void 0 == a)
                a = parseInt(b);
            else if (a != b)
                throw this.propagate_select(),
                "Incompatible widths specified for wire: " + b.toString() + ", " + a.toString();
        a && (this.connections[0].propagate_width(a),
        this.connections[1].propagate_width(a))
    }
    ,
    m.prototype.propagate_label = function(a) {
        this.connections[0].propagate_label(a),
        this.connections[1].propagate_label(a)
    }
    ,
    m.prototype.label_connections = function() {}
    ,
    m.prototype.netlist = function() {
        return void 0
    }
    ,
    n.prototype = new a.model.Component,
    n.prototype.constructor = n,
    n.prototype.type = function() {
        return "ground"
    }
    ,
    a.model.built_in_components.ground = n;
    var E = {
        get_name: function() {
            return "ground"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            global_signal: {
                label: "Global signal name",
                type: "string",
                value: "gnd",
                edit: "no",
                choices: [""]
            }
        }
    };
    n.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = {},
        this.default_properties(),
        this.add_connection(0, 0);
        var b = [-6, 0, 6, 14];
        this.bounding_box = b,
        this.update_coords()
    }
    ,
    n.prototype.draw = function(a) {
        this.draw_line(a, 0, 0, 0, 8),
        this.draw_line(a, -6, 8, 6, 8),
        this.draw_line(a, -6, 8, 0, 14),
        this.draw_line(a, 6, 8, 0, 14)
    }
    ,
    n.prototype.netlist = function() {
        return [["ground", {
            gnd: "gnd"
        }, {}]]
    }
    ,
    o.prototype = new a.model.Component,
    o.prototype.constructor = o,
    o.prototype.type = function() {
        return "vdd"
    }
    ,
    a.model.built_in_components.vdd = o;
    var F = {
        get_name: function() {
            return "vdd"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            global_signal: {
                label: "Global signal name",
                type: "signal",
                value: "Vdd",
                edit: "yes",
                choices: [""]
            }
        }
    };
    o.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.add_connection(0, 0);
        var b = [-6, -8, 6, 0];
        this.bounding_box = b,
        this.update_coords()
    }
    ,
    o.prototype.draw = function(a) {
        this.draw_line(a, 0, 0, 0, -8),
        this.draw_line(a, -6, -8, 6, -8),
        this.draw_text(a, this.properties.global_signal, 0, -10, 7, a.property_font)
    }
    ,
    o.prototype.netlist = function() {
        return void 0
    }
    ,
    p.prototype = new a.model.Component,
    p.prototype.constructor = p,
    p.prototype.type = function() {
        return "jumper"
    }
    ,
    a.model.built_in_components.jumper = p;
    var G = {
        get_name: function() {
            return "jumper"
        },
        has_aspect: function() {
            return !1
        },
        properties: {}
    };
    p.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.add_connection(0, 0, "n1"),
        this.add_connection(8, 0, "n2");
        var b = [0, -4, 8, 0];
        this.bounding_box = b,
        this.update_coords()
    }
    ,
    p.prototype.draw = function(a) {
        this.draw_arc(a, 0, 0, 8, 0, 4, -4)
    }
    ,
    q.prototype = new a.model.Component,
    q.prototype.constructor = q,
    q.prototype.type = function() {
        return "port"
    }
    ,
    a.model.built_in_components.port = q;
    var H = {
        get_name: function() {
            return "port"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            signal: {
                label: "Signal name",
                type: "signal",
                value: "???",
                edit: "yes",
                choices: [""]
            },
            direction: {
                label: "Direction",
                type: "menu",
                value: "in",
                edit: "yes",
                choices: ["in", "out", "inout"]
            }
        }
    };
    q.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.add_connection(0, 0);
        var b = [-24, -4, 0, 4];
        this.bounding_box = b,
        this.update_coords()
    }
    ,
    q.prototype.draw = function(a) {
        this.draw_line(a, 0, 0, -8, 0),
        this.draw_line(a, -8, 0, -12, -4),
        this.draw_line(a, -12, -4, -24, -4),
        this.draw_line(a, -8, 0, -12, 4),
        this.draw_line(a, -12, 4, -24, 4),
        this.draw_line(a, -24, -4, -24, 4),
        this.draw_text(a, this.properties.signal, -26, 0, 5, a.property_font),
        this.draw_line(a, -14, 0, -20, 0);
        var b = this.properties.direction;
        ("in" == b || "inout" == b) && (this.draw_line(a, -14, 0, -16, -2),
        this.draw_line(a, -14, 0, -16, 2)),
        ("out" == b || "inout" == b) && (this.draw_line(a, -20, 0, -18, -2),
        this.draw_line(a, -20, 0, -18, 2))
    }
    ,
    q.prototype.netlist = function() {
        return void 0
    }
    ;
    var I = ["top-left", "top-center", "top-right", "center-left", "center", "center-right", "bottom-left", "bottom-center", "bottom-right"]
      , J = $("<canvas></canvas>");
    s.prototype = new a.model.Component,
    s.prototype.constructor = s,
    s.prototype.required_grid = 1,
    s.prototype.type = function() {
        return "text"
    }
    ,
    a.model.built_in_components.text = s;
    var K = {
        get_name: function() {
            return "text"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            text: {
                type: "string",
                label: "Text",
                value: "???",
                edit: "yes"
            },
            font: {
                type: "string",
                label: "CSS Font",
                value: "6pt sans-serif",
                edit: "yes"
            },
            align: {
                type: "menu",
                label: "Alignment",
                value: "center-left",
                edit: "yes",
                choices: I
            }
        }
    };
    s.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.bounding_box = r(this.properties.text, this.properties.align, this.properties.font),
        this.update_coords()
    }
    ,
    s.prototype.drag_callback = function() {
        return !0
    }
    ,
    s.prototype.draw = function(a) {
        this.selected && (this.draw_line(a, -1, 0, 1, 0),
        this.draw_line(a, 0, -1, 0, 1));
        var b = I.indexOf(this.properties.align);
        this.draw_text(a, this.properties.text, 0, 0, b, this.properties.font)
    }
    ,
    s.prototype.draw_icon = function(b, c) {
        var d = I.indexOf(this.properties.align);
        d = a.model.aOrient[9 * this.coords[2] + d],
        b.draw_text(c, this.properties.text, this.coords[0], this.coords[1], d, this.properties.font)
    }
    ,
    s.prototype.edit_properties = function(b, c, d) {
        return a.model.Component.prototype.edit_properties.call(this, b, c, d, function(a) {
            a.bounding_box = r(a.properties.text, a.properties.align),
            a.update_coords()
        }
        )
    }
    ,
    s.prototype.netlist = function() {
        return void 0
    }
    ,
    t.prototype = new a.model.Component,
    t.prototype.constructor = t,
    t.prototype.type = function() {
        return "memory"
    }
    ,
    a.model.built_in_components.memory = t;
    var L = {
        name: "memory",
        get_name: function() {
            return "memory"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            name: {
                label: "Name",
                type: "name",
                value: "",
                edit: "yes",
                choices: [""]
            },
            nports: {
                label: "Number of ports",
                type: "menu",
                value: "1",
                edit: "yes",
                choices: ["1", "2", "3"]
            },
            naddr: {
                label: "Width of address (1..20)",
                type: "custom",
                value: "1",
                edit: "yes",
                choices: [""]
            },
            ndata: {
                label: "Width of data (1..128)",
                type: "custom",
                value: "1",
                edit: "yes",
                choices: [""]
            },
            contents: {
                label: "Contents",
                type: "custom",
                value: "",
                edit: "yes",
                choices: [""]
            }
        }
    };
    t.prototype.rebuild_connections = function() {
        this.name = this.properties.name,
        this.name && (this.name = this.name.toLowerCase());
        var a = this.aspect;
        a && $.each(this.connections, function(b, c) {
            a.remove_connection_point(c, c.location)
        }
        ),
        this.connections = [];
        var b, c = 0;
        this.ports = [];
        for (var d, e = 0; e < this.properties.nports; e += 1)
            d = {},
            this.ports.push(d),
            b = "A_" + e.toString() + "[" + (this.properties.naddr - 1).toString(),
            b += this.properties.naddr > 1 ? ":0]" : "]",
            d.addr = this.add_connection(0, c, b),
            b = "D_" + e.toString() + "[" + (this.properties.ndata - 1).toString(),
            b += this.properties.ndata > 1 ? ":0]" : "]",
            d.data = this.add_connection(72, c, b),
            d.oe = this.add_connection(0, c + 8, "OE_" + e.toString()),
            d.wen = this.add_connection(0, c + 16, "WE_" + e.toString()),
            d.clk = this.add_connection(0, c + 24, "CLK_" + e.toString()),
            c += 40;
        this.bounding_box = [0, -24, 72, c - 8],
        this.update_coords()
    }
    ,
    t.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.rebuild_connections()
    }
    ,
    t.prototype.validate_property = function(b, c, d) {
        var e, f, g;
        if ("naddr" == c) {
            if (e = a.utils.parse_number(d),
            isNaN(e))
                return b.text("not a valid number"),
                !1;
            if (1 > e || e > 20)
                return b.text("not in range 1..20"),
                !1
        } else if ("ndata" == c) {
            if (e = a.utils.parse_number(d),
            isNaN(e))
                return b.text("not a valid number"),
                !1;
            if (1 > e || e > 128)
                return b.text("not in range 1..128"),
                !1
        } else if ("contents" == c)
            for (g = a.utils.parse_nlist(d),
            f = 0; f < g.length; f += 1)
                if (void 0 !== g[f] && isNaN(g[f]))
                    return b.text("item " + (f + 1).toString() + " not a valid number"),
                    !1;
        return !0
    }
    ,
    t.prototype.update_properties = function(b) {
        a.model.Component.prototype.update_properties.call(this, b),
        this.rebuild_connections()
    }
    ,
    t.prototype.draw = function(a) {
        var b = this.bounding_box;
        this.draw_line(a, b[0] + 8, b[1], b[2] - 8, b[1]),
        this.draw_line(a, b[0] + 8, b[1], b[0] + 8, b[3]),
        this.draw_line(a, b[2] - 8, b[1], b[2] - 8, b[3]),
        this.draw_line(a, b[0] + 8, b[1] + 16, b[2] - 8, b[1] + 16);
        var c = 0
          , d = "A[" + (this.properties.naddr - 1).toString();
        d += this.properties.naddr > 1 ? ":0]" : "]";
        var e = "D[" + (this.properties.ndata - 1).toString();
        e += this.properties.ndata > 1 ? ":0]" : "]";
        for (var f = "4pt sans-serif", g = 0; g < this.properties.nports; g += 1)
            this.draw_line(a, 0, c, 8, c),
            this.draw_text(a, d, 9, c, 3, f),
            this.draw_line(a, 64, c, 72, c),
            this.draw_text(a, e, 63, c, 5, f),
            this.draw_line(a, 0, c + 8, 8, c + 8),
            this.draw_text(a, "OE", 9, c + 8, 3, f),
            this.draw_line(a, 0, c + 16, 8, c + 16),
            this.draw_text(a, "WE", 9, c + 16, 3, f),
            this.draw_line(a, 0, c + 24, 8, c + 24),
            this.draw_line(a, 8, c + 22, 12, c + 24),
            this.draw_line(a, 8, c + 26, 12, c + 24),
            this.draw_line(a, 8, c + 32, 64, c + 32),
            c += 40;
        this.draw_text(a, this.properties.name || "Memory", 36, -16, 7, a.property_font);
        var h = 1 << this.properties.naddr;
        this.draw_text(a, h.toString() + "\xd7" + this.properties.ndata, 36, -16, 1, a.property_font)
    }
    ,
    t.prototype.netlist = function(b, c, d) {
        if (-1 == b.indexOf("memory"))
            return void 0;
        var e = []
          , f = {};
        $.each(this.ports, function(a, b) {
            var c = {};
            $.each(["addr", "data", "oe", "wen", "clk"], function(a, e) {
                var g = b[e]
                  , h = g.label.length
                  , i = g.nlist.length;
                if (h != i)
                    throw this.selected = !0,
                    "Expected " + i + "connections for terminal " + g.name + " of memory " + d + this.name + ", got" + h;
                for (var j = 0; h > j; j += 1)
                    f[g.nlist[j]] = g.label[j];
                c[e] = g.label
            }
            ),
            e.push(c)
        }
        );
        for (var g = a.utils.parse_nlist(this.properties.contents || ""), h = 0; h < g.length; h += 1)
            void 0 !== g[h] && (g[h] = Math.floor(g[h]));
        return [["memory", f, {
            name: d + this.name,
            ports: e,
            width: this.properties.ndata,
            nlocations: 1 << this.properties.naddr,
            contents: g
        }]]
    }
    ;
    var M = 42
      , N = 42;
    return u.prototype.resize = function(a, b) {
        var c = $(this.top_level);
        c.height(b)
    }
    ,
    u.prototype.show = function() {
        var b = this
          , c = $(this.top_level);
        c.empty();
        var d = (this.parts_wanted || [".*"]).map(function(a) {
            return new RegExp(a)
        }
        )
          , e = [];
        a.model.map_modules(d, function(a) {
            var b = a.get_name();
            -1 == e.indexOf(b) && e.push(b)
        }
        ),
        $.each(d, function(a, c) {
            c.test("memory") && b.editor.memory_part.show()
        }
        ),
        e.sort(),
        e.length <= 5 && c.width(75);
        var f, g = "";
        $.each(e, function(d, e) {
            var h = b.parts[e];
            void 0 === h && (h = new v(b.editor),
            b.parts[e] = h,
            h.set_component(a.model.make_component([e, [0, 0, 0]]))),
            h.component.compute_bbox(),
            h.rescale(),
            h.redraw(),
            h.canvas.mouseover(w).mouseout(x).mousedown(y).mouseup(z),
            b.editor.jade.configuration.hierarchical && h.component.can_view() && (h.canvas.dblclick(A),
            h.can_edit = !0);
            var i = h.component.module.get_name().split("/")
              , j = i.length > 1 ? i.slice(0, i.length - 1).join("/") : "/user";
            if (g != j) {
                var k = $('<div class="jade-xparts-header"></div>');
                k.append('<span class="fa fa-caret-down fa-fw"></span>'),
                k.append(j),
                f = $('<div class="jade-xparts-list"></div>');
                var l = f
                  , m = $("span", k);
                k.on("click", function(a) {
                    return m.hasClass("fa-caret-down") ? m.removeClass("fa-caret-down").addClass("fa-caret-right") : m.removeClass("fa-caret-right").addClass("fa-caret-down"),
                    l.animate({
                        height: "toggle"
                    }),
                    a.preventDefault(),
                    !1
                }
                ),
                g = j,
                c.append(k, l)
            }
            f.append(h.canvas)
        }
        ),
        c.width(c.width() - 1),
        c.width(c.width() + 1)
    }
    ,
    v.prototype.rescale = function() {
        var a = this.component.bounding_box;
        1 / 0 == a[0] && (a = [-1, -1, 1, 1]);
        var b = a[2] - a[0]
          , c = a[3] - a[1];
        this.scale = Math.min(M / (1.1 * Math.abs(b)), N / (1.1 * Math.abs(c)), .8),
        this.origin_x = a[0] + b / 2 - M / (2 * this.scale),
        this.origin_y = a[1] + c / 2 - N / (2 * this.scale)
    }
    ,
    v.prototype.set_component = function(a) {
        this.component = a
    }
    ,
    v.prototype.redraw = function() {
        var a = this.canvas[0].getContext("2d");
        this.c = a,
        a.clearRect(0, 0, this.canvas[0].width, this.canvas[0].height),
        this.component && this.component.draw(this)
    }
    ,
    v.prototype.select = function(a) {
        this.selected = a,
        this.redraw()
    }
    ,
    v.prototype.update_connection_point = function() {}
    ,
    v.prototype.moveTo = function(a, b) {
        var c = Math.floor((a - this.origin_x) * this.scale) + .5
          , d = Math.floor((b - this.origin_y) * this.scale) + .5;
        this.c.moveTo(c, d)
    }
    ,
    v.prototype.lineTo = function(a, b) {
        var c = Math.floor((a - this.origin_x) * this.scale) + .5
          , d = Math.floor((b - this.origin_y) * this.scale) + .5;
        this.c.lineTo(c, d)
    }
    ,
    v.prototype.line_width = function(a) {
        return Math.max(1, Math.floor(a * this.scale))
    }
    ,
    v.prototype.draw_line = function(a, b, c, d, e) {
        var f = this.c;
        f.lineWidth = this.line_width(e),
        f.beginPath(),
        this.moveTo(a, b),
        this.lineTo(c, d),
        f.stroke()
    }
    ,
    v.prototype.draw_arc = function(a, b, c, d, e, f, g, h) {
        var i = this.c;
        i.lineWidth = this.line_width(g),
        i.beginPath();
        var j = Math.floor((a - this.origin_x) * this.scale) + .5
          , k = Math.floor((b - this.origin_y) * this.scale) + .5;
        i.arc(j, k, Math.max(1, c * this.scale), d, e, f),
        h ? i.fill() : i.stroke()
    }
    ,
    v.prototype.draw_text = function(a, b, c, d) {
        this.draw_text_important(a, b, c, d)
    }
    ,
    v.prototype.draw_text_important = function(a, b, c, d) {
        var e = this.c
          , f = d.match(/\d+/)[0];
        f = Math.max(2, Math.round(f * this.scale)),
        e.font = d.replace(/\d+/, f.toString()),
        e.fillStyle = "rgb(0,0,0)";
        var g = Math.floor((b - this.origin_x) * this.scale) + .5
          , h = Math.floor((c - this.origin_y) * this.scale) + .5;
        e.fillText(a, g, h)
    }
    ,
    {
        schematic_tools: B,
        text_alignments: I,
        text_bbox: r
    }
}
,
jade_defs.icon_view = function(a) {
    function b(b, n) {
        function r(a) {
            return a.aspect && !a.aspect.read_only() && a.aspect.selections()
        }
        function s() {
            return this.diagram && this.diagram.aspect && !this.diagram.aspect.read_only()
        }
        this.jade = n,
        this.status = n.status,
        this.tab = b.tab,
        this.diagram = new a.Diagram(this,"jade-icon-diagram"),
        b.diagram = this.diagram,
        this.diagram.grid = 8,
        this.diagram.zoom_factor = 1.25,
        this.diagram.zoom_min = Math.pow(this.diagram.zoom_factor, 1),
        this.diagram.zoom_max = Math.pow(this.diagram.zoom_factor, 10),
        this.diagram.origin_min = -64,
        this.diagram.origin_max = 64,
        $(this.diagram.canvas).mouseover(j).mouseout(k).mousemove(o).mousedown(m).mouseup(p).dblclick(q).keydown(l),
        this.toolbar = new a.Toolbar(this.diagram),
        n.configuration.readonly || (this.toolbar.add_tool("grid", a.icons.grid_icon, "Toggle schematic grid", a.diagram_toggle_grid),
        this.toolbar.add_spacer(),
        this.toolbar.add_tool("undo", a.icons.undo_icon, "Undo: undo effect of previous action (\u2318Z, ctrl-Z)", a.diagram_undo, function(a) {
            return a.aspect && a.aspect.can_undo()
        }
        ),
        this.toolbar.add_tool("redo", a.icons.redo_icon, "redo: redo effect of next action (\u2318Y, ctrl-Y)", a.diagram_redo, function(a) {
            return a.aspect && a.aspect.can_redo()
        }
        ),
        this.toolbar.add_tool("cut", a.icons.cut_icon, "Cut: move selected components from diagram to the clipboard (\u2318X, ctrl-X)", a.diagram_cut, r),
        this.toolbar.add_tool("copy", a.icons.copy_icon, "Copy: copy selected components into the clipboard (\u2318C, ctrl-C)", a.diagram_copy, r),
        this.toolbar.add_tool("paste", a.icons.paste_icon, "Paste: copy clipboard into the diagram (\u2318V, ctrl-V)", a.diagram_paste, function(b) {
            return b.aspect && !b.aspect.read_only() && a.clipboards[b.editor.editor_name].length > 0
        }
        ),
        this.toolbar.add_tool("fliph", a.icons.fliph_icon, "Flip Horizontally: flip selection horizontally", a.diagram_fliph, r),
        this.toolbar.add_tool("flipv", a.icons.flipv_icon, "Flip Vertically: flip selection vertically", a.diagram_flipv, r),
        this.toolbar.add_tool("rotcw", a.icons.rotcw_icon, "Rotate Clockwise: rotate selection clockwise", a.diagram_rotcw, r),
        this.toolbar.add_tool("rotccw", a.icons.rotccw_icon, "Rotate Counterclockwise: rotate selection counterclockwise", a.diagram_rotccw, r),
        this.toolbar.add_spacer(),
        this.modes = {},
        this.modes.select = this.toolbar.add_tool("select", a.icons.select_icon, "Select mode", c, s),
        this.set_mode("select"),
        this.modes.line = this.toolbar.add_tool("line", a.icons.line_icon, "Icon line mode", d, s),
        this.modes.arc = this.toolbar.add_tool("arc", a.icons.arc_icon, "Icon arc mode", e, s),
        this.modes.circle = this.toolbar.add_tool("circle", a.icons.circle_icon, "Icon circle mode", f, s),
        this.modes.text = this.toolbar.add_tool("text", a.icons.text_icon, "Icon text mode", g, s),
        this.modes.terminal = this.toolbar.add_tool("terminal", a.icons.terminal_icon, "Icon terminal mode", h, s),
        this.modes.property = this.toolbar.add_tool("property", a.icons.property_icon, "Icon property mode", i, s),
        this.toolbar.add_spacer());
        for (var t = 0; t < w.length; t += 1) {
            var u = w[t];
            this.toolbar.add_tool(u[0], u[1], u[2], u[3], u[4])
        }
        b.appendChild(this.toolbar.toolbar[0]),
        b.appendChild(this.diagram.canvas);
        var v = new a.model.Aspect("untitled",null );
        this.diagram.set_aspect(v)
    }
    function c(a) {
        a.editor.set_mode("select")
    }
    function d(a) {
        a.editor.set_mode("line")
    }
    function e(a) {
        a.editor.set_mode("arc")
    }
    function f(a) {
        a.editor.set_mode("circle")
    }
    function g(a) {
        a.editor.set_mode("text")
    }
    function h(a) {
        a.editor.set_mode("terminal")
    }
    function i(a) {
        a.editor.set_mode("property")
    }
    function j(a) {
        var b = a.target.diagram;
        return b.canvas.focus(),
        b.editor.status.text(x[b.editor.mode]),
        a.preventDefault(),
        !1
    }
    function k(a) {
        var b = a.target.diagram;
        return b.editor.status.text(""),
        a.preventDefault(),
        !1
    }
    function l(a) {
        var b = a.target.diagram
          , c = a.keyCode;
        if (32 == c)
            b.editor.set_mode("select");
        else if (b.key_down(a))
            return !0;
        return a.preventDefault(),
        !1
    }
    function m(a) {
        var b = a.target.diagram;
        if (b.event_coords(a),
        b.pan_zoom())
            return !1;
        var c = b.editor
          , d = b.cursor_x
          , e = b.cursor_y;
        return "arc2" == c.mode ? (c.drag_callback(d, e, "done"),
        b.aspect.end_action(),
        c.drag_callback = void 0,
        c.mode = "arc") : "select" != c.mode ? (c.start_x = d,
        c.start_y = e) : b.start_select(a.shiftKey),
        a.preventDefault(),
        !1
    }
    function n(b) {
        var c = b.editor;
        b.unselect_all(-1),
        b.redraw_background(),
        b.aspect.start_action();
        var d = a.model.make_component([c.mode, [c.start_x, c.start_y, 0]]);
        d.add(b.aspect),
        d.selected = !0,
        c.drag_callback = function(a, c, e) {
            "abort" != e && d.drag_callback(a, c, e) ? b.redraw() : (d.remove(),
            b.redraw_background())
        }
        ,
        c.start_x = void 0
    }
    function o(a) {
        var b = a.target.diagram;
        b.event_coords(a);
        var c = b.editor;
        return void 0 !== c.start_x && n(b),
        c.drag_callback ? c.drag_callback(b.cursor_x, b.cursor_y, c.mode) : b.mouse_move(),
        a.preventDefault(),
        !1
    }
    function p(a) {
        var b = a.target.diagram;
        b.event_coords(a);
        var c = b.editor;
        if (void 0 !== c.start_x && n(b),
        c.drag_callback) {
            var d = b.cursor_x
              , e = b.cursor_y;
            "arc" == c.mode ? (c.drag_callback(d, e, "arc"),
            c.mode = "arc2") : (c.drag_callback(d, e, "done"),
            b.aspect.end_action(),
            c.drag_callback = void 0)
        } else
            b.mouse_up(a.shiftKey);
        return a.preventDefault(),
        !1
    }
    function q(a) {
        var b = a.target.diagram;
        return b.event_coords(a),
        b.aspect && !b.aspect.read_only() && b.aspect.map_over_components(function(a) {
            return a.edit_properties(b, b.aspect_x, b.aspect_y) ? !0 : !1
        }
        ),
        a.preventDefault(),
        !1
    }
    function r(b) {
        a.model.Component.call(this),
        this.module = y,
        this.load(b)
    }
    function s(b) {
        a.model.Component.call(this),
        this.module = A,
        this.load(b)
    }
    function t(b) {
        a.model.Component.call(this),
        this.module = B,
        this.load(b)
    }
    function u(b) {
        a.model.Component.call(this),
        this.module = C,
        this.load(b)
    }
    function v(b) {
        a.model.Component.call(this),
        this.module = D,
        this.load(b)
    }
    var w = [];
    b.prototype.diagram_changed = function(a) {
        var b = a.aspect.module;
        if (b) {
            var c = this.jade.configuration.tests;
            delete c[b.get_name()],
            b.notify_listeners("icon_changed")
        }
    }
    ,
    b.prototype.resize = function(a, b, c) {
        this.w = a,
        this.h = b;
        var d = $(this.diagram.canvas)
          , e = d.outerWidth(!0) - d.width()
          , f = d.outerHeight(!0) - d.height()
          , g = this.toolbar.toolbar.outerHeight(!0)
          , h = a - e
          , i = b - f - g;
        d.width(h),
        d.height(i),
        c && this.diagram.resize()
    }
    ,
    b.prototype.show = function() {
        this.diagram.canvas.focus(),
        this.resize(this.w, this.h, !0)
    }
    ,
    b.prototype.set_aspect = function(c) {
        var d = c.aspect(b.prototype.editor_name);
        $(this.tab).html(b.prototype.editor_name),
        d.read_only() && $(this.tab).append(" " + a.icons.readonly),
        this.diagram.set_aspect(d)
    }
    ,
    b.prototype.editor_name = "icon",
    a.editors.push(b),
    b.prototype.redraw = function(a) {
        this.toolbar && this.toolbar.enable_tools(this.diagram);
        var b = a.editor;
        if ("select" != b.mode) {
            var c = a.cursor_x
              , d = a.cursor_y;
            a.c.strokeStyle = a.normal_style,
            a.draw_line(c - 2, d - 2, c + 2, d + 2, .1),
            a.draw_line(c + 2, d - 2, c - 2, d + 2, .1),
            a.c.textAlign = "left",
            a.c.textBaseline = "middle",
            a.c.fillStyle = a.normal_style,
            a.draw_text(b.mode, c + 4, d, a.property_font)
        }
    }
    ;
    var x = {
        select: "Click component to select, click and drag on background for area select, shift-click and drag on background to pan",
        line: "Click and drag to draw line",
        arc: "Click and drag to draw chord, then click again to set radius",
        circle: "Click at center point, drag to set radisu",
        text: "Click to insert text",
        terminal: "Click to insert terminal",
        property: "Click to insert property tag"
    };
    b.prototype.set_mode = function(b) {
        this.mode = b,
        this.start_x = void 0,
        this.drag_callback && (this.drag_callback(void 0, void 0, "abort"),
        this.diagram.aspect.end_action(),
        this.drag_callback = void 0);
        var c = a.model.built_in_components[b];
        this.diagram.set_cursor_grid(c ? c.prototype.required_grid : 1),
        this.diagram.canvas.style.cursor = "select" == b ? "auto" : "none";
        for (var d in this.modes)
            this.modes[d].toggleClass("icon-tool-selected", b == d);
        this.status.text(x[b])
    }
    ,
    r.prototype = new a.model.Component,
    r.prototype.constructor = r,
    r.prototype.required_grid = 1,
    r.prototype.type = function() {
        return "line"
    }
    ,
    a.model.built_in_components.line = r;
    var y = {
        get_name: function() {
            return "line"
        },
        has_aspect: function() {
            return !1
        },
        properties: {}
    }
      , z = 2;
    r.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.setup_bbox()
    }
    ,
    r.prototype.setup_bbox = function() {
        var b = this.coords[3]
          , c = this.coords[4]
          , d = [0, 0, b, c];
        a.model.canonicalize(d),
        d[0] -= z,
        d[1] -= z,
        d[2] += z,
        d[3] += z,
        this.bounding_box = d,
        this.update_coords(),
        this.len = Math.sqrt(b * b + c * c)
    }
    ,
    r.prototype.drag_callback = function(a, b, c) {
        if (this.coords[3] = a - this.coords[0],
        this.coords[4] = b - this.coords[1],
        "done" == c) {
            if (0 === this.coords[3] && 0 == this.coords[4])
                return !1;
            this.setup_bbox()
        }
        return !0
    }
    ,
    r.prototype.draw = function(a) {
        var b = this.coords[3]
          , c = this.coords[4];
        this.draw_line(a, 0, 0, b, c)
    }
    ,
    r.prototype.draw_icon = function(a, b) {
        var c = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0]
          , d = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        a.draw_line(b, this.coords[0], this.coords[1], c, d)
    }
    ,
    r.prototype.distance = function(a, b) {
        var c = this.transform_x(this.coords[3], this.coords[4])
          , d = this.transform_y(this.coords[3], this.coords[4])
          , e = Math.abs((a - this.coords[0]) * d - (b - this.coords[1]) * c) / this.len;
        return e
    }
    ,
    r.prototype.near = function(a, b) {
        return this.inside(a, b) && this.distance(a, b) <= z ? !0 : !1
    }
    ,
    r.prototype.select_rect = function(a) {
        this.was_previously_selected = this.selected;
        var b = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0]
          , c = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        (this.inside(this.coords[0], this.coords[1], a) || this.inside(b, c, a)) && this.set_select(!0)
    }
    ,
    s.prototype = new a.model.Component,
    s.prototype.constructor = s,
    s.prototype.required_grid = 1,
    s.prototype.type = function() {
        return "arc"
    }
    ,
    a.model.built_in_components.arc = s;
    var A = {
        get_name: function() {
            return "arc"
        },
        has_aspect: function() {
            return !1
        },
        properties: {}
    };
    s.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.setup_bbox()
    }
    ,
    s.prototype.setup_bbox = function() {
        var b = this.coords[3]
          , c = this.coords[4]
          , d = this.coords[5]
          , e = this.coords[6];
        if (void 0 === d)
            r.prototype.setup_bbox.call(this);
        else {
            var f = [0, 0, b, c];
            a.model.canonicalize(f),
            d < f[0] ? f[0] = d : d > f[2] && (f[2] = d),
            e < f[1] ? f[1] = e : e > f[3] && (f[3] = e),
            a.model.canonicalize(f),
            this.bounding_box = f,
            this.update_coords()
        }
    }
    ,
    s.prototype.drag_callback = function(a, b, c) {
        if ("arc" == c ? (this.coords[3] = a - this.coords[0],
        this.coords[4] = b - this.coords[1]) : (this.coords[5] = a - this.coords[0],
        this.coords[6] = b - this.coords[1]),
        "done" == c) {
            if (0 === this.coords[3] && 0 == this.coords[4])
                return !1;
            this.setup_bbox()
        }
        return !0
    }
    ,
    s.prototype.draw = function(a) {
        var b, c;
        void 0 !== this.coords[5] ? (b = this.coords[5],
        c = this.coords[6]) : (b = this.coords[3],
        c = this.coords[4]),
        this.draw_arc(a, 0, 0, this.coords[3], this.coords[4], b, c)
    }
    ,
    s.prototype.draw_icon = function(a, b) {
        var c, d, e = this.transform_x(this.coords[3], this.coords[4]) + this.coords[0], f = this.transform_y(this.coords[3], this.coords[4]) + this.coords[1];
        void 0 !== this.coords[5] ? (c = this.transform_x(this.coords[5], this.coords[6]) + this.coords[0],
        d = this.transform_y(this.coords[5], this.coords[6]) + this.coords[1]) : (c = e,
        d = f),
        a.draw_arc(b, this.coords[0], this.coords[1], e, f, c, d)
    }
    ,
    t.prototype = new a.model.Component,
    t.prototype.constructor = t,
    t.prototype.required_grid = 1,
    t.prototype.type = function() {
        return "circle"
    }
    ,
    a.model.built_in_components.circle = t;
    var B = {
        get_name: function() {
            return "circle"
        },
        has_aspect: function() {
            return !1
        },
        properties: {}
    };
    t.prototype.load = function(a) {
        this.coords = a[1],
        this.properties = a[2] || {},
        this.default_properties(),
        this.setup_bbox()
    }
    ,
    t.prototype.setup_bbox = function() {
        var a = this.coords[3];
        this.bounding_box = [-a, -a, a, a],
        this.update_coords()
    }
    ,
    t.prototype.drag_callback = function(a, b, c) {
        var d = a - this.coords[0]
          , e = b - this.coords[1];
        if (this.coords[3] = Math.sqrt(d * d + e * e),
        "done" == c) {
            if (0 === this.coords[3])
                return !1;
            this.setup_bbox()
        }
        return !0
    }
    ,
    t.prototype.draw = function(a) {
        this.draw_circle(a, 0, 0, this.coords[3], !1)
    }
    ,
    t.prototype.draw_icon = function(a, b) {
        a.draw_circle(b, this.coords[0], this.coords[1], this.coords[3], !1)
    }
    ,
    u.prototype = new a.model.Component,
    u.prototype.constructor = u,
    u.prototype.required_grid = 1,
    u.prototype.type = function() {
        return "property"
    }
    ,
    a.model.built_in_components.property = u;
    var C = {
        get_name: function() {
            return "property"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            format: {
                type: "string",
                label: "Format",
                value: "{???}",
                edit: "yes"
            },
            align: {
                type: "menu",
                label: "Alignment",
                value: "center-left",
                edit: "yes",
                choices: a.schematic_view.text_alignments
            }
        }
    };
    u.prototype.load = function(b) {
        this.coords = b[1],
        this.properties = b[2] || {},
        this.default_properties(),
        this.bounding_box = a.schematic_view.text_bbox(this.properties.format, this.properties.align, "5pt sans-serif"),
        this.update_coords()
    }
    ,
    u.prototype.drag_callback = function() {
        return !0
    }
    ,
    u.prototype.draw = function(b) {
        this.selected && (this.draw_line(b, -1, 0, 1, 0),
        this.draw_line(b, 0, -1, 0, 1));
        var c = a.schematic_view.text_alignments.indexOf(this.properties.align);
        this.draw_text(b, this.properties.format || "-no format-", 0, 0, c, b.property_font)
    }
    ,
    u.prototype.draw_icon = function(b, c) {
        var d = this.properties.format || "-no format-";
        if (!/\{name\}/.test(d) || !b.properties.name || "$" != b.properties.name[0]) {
            for (var e in b.properties) {
                var f = b.properties[e] || "";
                d = d.replace(new RegExp("\\{" + e + "\\}","gm"), f)
            }
            d = d.replace(new RegExp("\\{module\\}","gm"), b.module.get_name());
            var g = a.schematic_view.text_alignments.indexOf(this.properties.align);
            g = a.model.aOrient[9 * this.coords[2] + g],
            b.draw_text(c, d, this.coords[0], this.coords[1], g, c.property_font)
        }
    }
    ,
    u.prototype.edit_properties = function(b, c, d) {
        return a.model.Component.prototype.edit_properties.call(this, b, c, d, function(c) {
            c.bounding_box = a.schematic_view.text_bbox(c.properties.format, c.properties.align, b.property_font),
            c.update_coords()
        }
        )
    }
    ,
    v.prototype = new a.model.Component,
    v.prototype.constructor = v,
    v.prototype.required_grid = 8,
    v.prototype.type = function() {
        return "terminal"
    }
    ,
    a.model.built_in_components.terminal = v;
    var D = {
        get_name: function() {
            return "terminal"
        },
        has_aspect: function() {
            return !1
        },
        properties: {
            name: {
                type: "signal",
                label: "Terminal name",
                value: "???",
                edit: "yes"
            },
            line: {
                type: "menu",
                label: "Draw line?",
                value: "yes",
                edit: "yes",
                choices: ["yes", "no"]
            }
        }
    };
    return v.prototype.load = function(b) {
        this.coords = b[1],
        this.properties = b[2] || {},
        this.default_properties(),
        this.bounding_box = [-a.model.connection_point_radius, -a.model.connection_point_radius, 8 + a.model.connection_point_radius, a.model.connection_point_radius],
        this.update_coords()
    }
    ,
    v.prototype.drag_callback = function() {
        return !0
    }
    ,
    v.prototype.draw = function(b) {
        this.draw_circle(b, 0, 0, a.model.connection_point_radius, !1),
        "no" != this.properties.line && this.draw_line(b, 0, 0, 8, 0),
        this.draw_text(b, this.properties.name, a.model.connection_point_radius - 4, 0, 5, b.property_font)
    }
    ,
    v.prototype.draw_icon = function(a, b) {
        if ("no" != this.properties.line) {
            var c = this.coords[0]
              , d = this.coords[1]
              , e = this.transform_x(8, 0) + this.coords[0]
              , f = this.transform_y(8, 0) + this.coords[1];
            a.draw_line(b, c, d, e, f)
        }
    }
    ,
    v.prototype.terminal_coords = function() {
        return [this.coords[0], this.coords[1], this.properties.name]
    }
    ,
    {
        icon_tools: w
    }
}
,
jade_defs.property_view = function(a) {
    function b(a, b) {
        this.jade = b,
        this.status = b.status,
        this.module = void 0,
        this.tab = a.tab,
        this.table = $('<table class="jade-property-table"></div>'),
        $(a).append(this.table),
        this.build_table()
    }
    return b.prototype.resize = function() {}
    ,
    b.prototype.show = function() {}
    ,
    b.prototype.set_aspect = function(c) {
        this.module = c,
        $(this.tab).html(b.prototype.editor_name),
        c.read_only() && $(this.tab).append(" " + a.icons.readonly),
        this.build_table()
    }
    ,
    b.prototype.build_table = function() {
        var b, c = this, d = c.module, e = this.module && this.module.read_only();
        if (b = this.table,
        b.empty(),
        void 0 === d)
            return void b.append("<tr><td>To edit properites you must first specify a module.</td></tr>");
        if (b.append("<tr><th>Action</th><th>Name</th><th>Label</th><th>Type</th><th>Value</th><th>Edit</th><th>Choices</th></tr>"),
        $.each(d.properties, function(f, g) {
            function h(a, b, c) {
                var g = $("<td></td>").append(b);
                i.append(g),
                e && $(b).attr("disabled", "true"),
                $(b).on("change", function(b) {
                    var e = b.target.value.trim();
                    c && (e = c(e)),
                    d.set_property_attribute(f, a, e)
                }
                )
            }
            var i = $("<tr></tr>");
            b.append(i);
            var j = $("<td></td>");
            i.append(j);
            var k = a.build_button("delete", function() {
                d.remove_property(f),
                c.build_table()
            }
            );
            e && $(k).attr("disabled", "true"),
            j.append(k),
            j = $("<td></td>").text(f),
            i.append(j),
            h("label", a.build_input("text", 10, g.label || g.name)),
            h("type", a.build_select(["string", "name", "number", "nlist", "menu"], g.type || "string")),
            h("value", a.build_input("text", 10, g.value || "")),
            h("edit", a.build_select(["yes", "no"], g.edit || "yes")),
            h("choices", a.build_input("text", 15, g.choices ? g.choices.join() : ""), function(a) {
                var b = a.split(",").map(function(a) {
                    return a.trim()
                }
                );
                return b
            }
            )
        }
        ),
        !e) {
            var f = {};
            f.action = a.build_button("add", function() {
                var a = f.name.value.trim();
                if ("" === a)
                    alert("Please enter a name for the new property");
                else if (a in c.module.properties)
                    alert("Oops, duplicate property name!");
                else {
                    var b = {};
                    b.label = f.label.value.trim() || a,
                    b.type = f.type.value,
                    b.value = f.value.value.trim(),
                    b.edit = f.edit.value;
                    for (var d = f.choices.value.split(","), e = 0; e < d.length; e += 1)
                        d[e] = d[e].trim();
                    b.choices = d,
                    c.module.set_property(a, b),
                    c.build_table()
                }
            }
            ),
            f.name = a.build_input("text", 10, ""),
            f.label = a.build_input("text", 10, ""),
            f.type = a.build_select(["string", "name", "number", "nlist", "menu"], "string"),
            f.value = a.build_input("text", 10, ""),
            f.edit = a.build_select(["yes", "no"], "yes"),
            f.choices = a.build_input("text", 15, "");
            var g = $("<tr></tr>");
            for (var h in f)
                g.append($("<td></td>").append(f[h]));
            b.append(g)
        }
    }
    ,
    b.prototype.editor_name = "properties",
    a.editors.push(b),
    {}
}
,
jade_defs.test_view = function(a) {
    function b(b) {
        var c = b.aspect.module;
        if (c && c.has_aspect("test")) {
            var d = c.aspect("test").components[0];
            if (d)
                return f(d.test, b, c),
                a.model.save_modules(!0),
                void b.redraw_background()
        }
        b.message("This module does not have a test!")
    }
    function c(a, b) {
        this.jade = b,
        this.status = b.status,
        this.module = void 0,
        this.aspect = void 0,
        this.test_component = void 0,
        this.tab = a.tab;
        var c = $('<textarea class="jade-test-editor"></textarea>');
        this.textarea = c;
        var d = this;
        c.on("mouseleave", function() {
            if (d.test_component) {
                var a = c.val();
                d.test_component.test != a && (d.test_component.test = a,
                d.aspect.set_modified(!0))
            }
        }
        ),
        a.appendChild(c[0])
    }
    function d(b) {
        a.model.Component.call(this),
        this.load(b)
    }
    function e(b, c) {
        var d, e, f, g, h, i = [];
        for (d = 0; d < b.length; ) {
            if (d + 1 < b.length && "(" == b[d + 1]) {
                for (e = b[d],
                d += 2,
                f = [],
                h = e + "(",
                g = !1; d < b.length; ) {
                    if (")" == b[d]) {
                        h += ")",
                        g = !0;
                        break
                    }
                    "(" != h[h.length - 1] && (h += ","),
                    h += b[d],
                    $.each(a.utils.parse_signal(b[d]), function(a, b) {
                        f.push(b)
                    }
                    ),
                    d += 1,
                    d < b.length && "," == b[d] && (d += 1)
                }
                g ? i.push({
                    signals: f,
                    dfunction: e,
                    name: h
                }) : c.push("Missing ) in .plot statement: " + b.join(" "))
            } else
                $.each(a.utils.parse_signal(b[d]), function(a, b) {
                    i.push({
                        signals: [b],
                        dfunction: void 0,
                        name: b
                    })
                }
                );
            d += 1
        }
        return i
    }
    function f(b, c, d) {
        function f(a) {
            a in F || -1 != T.indexOf(a) || I.push('There are no devices connected to node "' + a + '".')
        }
        function i(a, b) {
            b != a[a.length - 1][1] && a.push([U, b])
        }
        function j(a) {
            var b, c, d, e, f, g, h, i, j, k, l = [], m = [], n = B.Vil || .2, o = B.Vih || .8, p = a.xvalues.length;
            for (c = 0; p > c; c += 1) {
                for (h = a.xvalues[c],
                i = a.yvalues[c],
                j = h.length,
                k = a.type[c],
                b = 0,
                g = void 0,
                d = 0; j > d; d += 1)
                    if (e = h[d],
                    f = i[d],
                    "analog" == k && (f = n >= f ? 0 : f >= o ? 1 : 2),
                    d == j - 1 || f != g) {
                        for (; b < l.length && !(l[b] >= e); )
                            m[b][c] = g,
                            b += 1;
                        if (l[b] == e)
                            m[b][c] = f;
                        else {
                            var q;
                            q = b > 0 ? m[b - 1].slice(0) : new Array,
                            q[c] = f,
                            l.splice(b, 0, e),
                            m.splice(b, 0, q)
                        }
                        g = f
                    }
                for (; b < l.length; )
                    m[b][c] = g,
                    b += 1
            }
            for (d = 0; d < m.length; d += 1) {
                for (i = m[d],
                f = 0,
                c = 0; p > c; c += 1)
                    if (b = i[c],
                    0 === b || 1 == b)
                        f = 2 * f + b;
                    else {
                        if (3 != b) {
                            f = void 0;
                            break
                        }
                        f = -1
                    }
                m[d] = f
            }
            return a.xvalues = l,
            a.yvalues = m,
            a.nnodes = p,
            a
        }
        function k(b, f) {
            function g(a) {
                var b, c = [], d = [], e = [], g = [], h = [], i = "device" == v ? "V" : "";
                return $.each(a, function(a, k) {
                    if ("I" == k.dfunction) {
                        var l = k.signals[0]
                          , m = "I(" + l + ")"
                          , n = f._network_.history(m);
                        if (void 0 === n)
                            throw "No voltage source named " + l;
                        g.push(A[c.length % A.length]),
                        c.push(n.xvalues),
                        d.push(n.yvalues),
                        e.push(m),
                        h.push(f._network_.result_type()),
                        i = "A"
                    } else if (k.dfunction) {
                        var o = []
                          , p = []
                          , q = []
                          , r = k.dfunction;
                        $.each(k.signals, function(a, b) {
                            var c = f._network_.history(b);
                            if (void 0 === c)
                                throw "No node named " + b;
                            o.push(c.xvalues),
                            p.push(c.yvalues),
                            q.push(f._network_.result_type())
                        }
                        ),
                        b = j({
                            xvalues: o,
                            yvalues: p,
                            type: q
                        }),
                        $.each(b.yvalues, function(a, c) {
                            if (void 0 !== c) {
                                if (0 > c)
                                    c = -1;
                                else if (r in H) {
                                    var d = H[r][c];
                                    c = d ? d : "0x" + ("0000000000000000" + c.toString(16)).substr(-Math.ceil(b.nnodes / 4))
                                } else if ("X" == r || "x" == r)
                                    c = "0x" + ("0000000000000000" + c.toString(16)).substr(-Math.ceil(b.nnodes / 4));
                                else if ("O" == r || "o" == r)
                                    c = "0" + ("0000000000000000000000" + c.toString(8)).substr(-Math.ceil(b.nnodes / 3));
                                else if ("B" == r || "b" == r)
                                    c = "0b" + ("0000000000000000000000000000000000000000000000000000000000000000" + c.toString(2)).substr(-Math.ceil(b.nnodes));
                                else if ("D" == r || "d" == r)
                                    c = c.toString(10);
                                else {
                                    if ("SD" != r && "sd" != r)
                                        throw "No definition for plot function " + r;
                                    c & 1 << b.nnodes - 1 && (c -= 1 << b.nnodes),
                                    c = c.toString(10)
                                }
                                b.yvalues[a] = c
                            }
                        }
                        ),
                        g.push(A[c.length % A.length]),
                        c.push(b.xvalues),
                        d.push(b.yvalues),
                        e.push(k.name),
                        h.push("string"),
                        i = ""
                    } else
                        $.each(k.signals, function(a, b) {
                            var i = f._network_.history(b);
                            if (void 0 === i)
                                throw "No node named " + b;
                            g.push(A[c.length % A.length]),
                            c.push(i.xvalues),
                            d.push(i.yvalues),
                            e.push(b),
                            h.push(f._network_.result_type())
                        }
                        )
                }
                ),
                c.length > 0 ? {
                    xvalues: c,
                    yvalues: d,
                    name: e,
                    xunits: "s",
                    yunits: i,
                    color: g,
                    type: h
                } : void 0
            }
            function h(b) {
                try {
                    var c = b.match(/([A-Za-z0-9_.:\[\]]+|=|-|,|\(|\))/g)
                      , d = []
                      , f = e(c, d);
                    if (d.length > 0)
                        throw "<li>" + d.join("<li>");
                    var h = g(f);
                    h && D.push(h)
                } catch (i) {
                    a.window("Error in Add Plot", $('<div class="jade-alert"></div>').html(i), C)
                }
            }
            if (void 0 === b) {
                if (a.window_close(W[0].win),
                "string" == typeof f)
                    return a.window("Error running test", $('<div class="jade-alert"></div>').html(f), $(c.canvas).offset()),
                    void (m[d.get_name()] = "Error detected: " + f);
                if (f instanceof Error)
                    return f = f.stack.split("\n").join("<br>"),
                    a.window("Error running test", $('<div class="jade-alert"></div>').html(f), $(c.canvas).offset()),
                    void (m[d.get_name()] = "Error detected: " + f.message);
                var i = [];
                $.each(G, function(a, b) {
                    $.each(b, function(b, c) {
                        i.push({
                            n: a,
                            t: c.t,
                            v: c.v,
                            i: c.i
                        })
                    }
                    )
                }
                ),
                i.sort(function(a, b) {
                    return a.t == b.t ? a.n < b.n ? -1 : a.n > b.n ? 1 : 0 : a.t - b.t
                }
                );
                for (var k, l, q, r, s = {}, t = [], u = 0; u < i.length && (q = i[u],
                !(k && k < q.i)); u += 1)
                    if (r = s[q.n],
                    void 0 === r && (r = f._network_.history(q.n),
                    s[q.n] = r),
                    "device" == v)
                        l = void 0 === r ? void 0 : a.device_level.interpolate(q.t, r.xvalues, r.yvalues),
                        (void 0 === l || "L" == q.v && l > B.Vil || "H" == q.v && l < B.Vih) && (t.push("Test " + q.i.toString() + ": Expected " + q.n + "=" + q.v + " at " + a.utils.engineering_notation(q.t, 2) + "s."),
                        k = q.i);
                    else {
                        if ("gate" != v)
                            throw "Unrecognized simulation mode: " + v;
                        l = void 0 === r ? void 0 : a.gate_level.interpolate(q.t, r.xvalues, r.yvalues),
                        (void 0 === l || "L" == q.v && 0 != l || "H" == q.v && 1 != l) && (t.push("Test " + q.i.toString() + ": Expected " + q.n + "=" + q.v + " at " + a.utils.engineering_notation(q.t, 2) + "s."),
                        k = q.i)
                    }
                $.each(y, function(a, b) {
                    var c = f._network_.device_map[a];
                    return void 0 === c ? void t.push('Cannot find memory named "' + a + '", verification aborted.') : (c = c.get_contents(),
                    void $.each(b, function(b, d) {
                        if (void 0 !== d && ((0 > b || b >= c.nlocations) && t.push("Location " + b.toString() + " out of range for memory " + a),
                        c[b] !== d)) {
                            var e = void 0 === c[b] ? "undefined" : "0x" + c[b].toString(16);
                            t.push(a + "[0x" + b.toString(16) + "]: Expected 0x" + d.toString(16) + ", got " + e)
                        }
                    }
                    ))
                }
                ),
                o = a.utils.md5(z.join("\n")),
                jade_defs.mverify_md5sum = o;
                var x = [];
                $.each(V, function(b, c) {
                    var d = [];
                    $.each(J, function(b, e) {
                        var g = s[e];
                        void 0 === g && (g = f._network_.history(e),
                        s[e] = g),
                        void 0 === g ? l = "?" : (l = a.gate_level.interpolate(c, g.xvalues, g.yvalues),
                        l = "01XZ"[l]),
                        d.push(l)
                    }
                    ),
                    x.push(d.join(""))
                }
                ),
                x.length > 0 && console.log(x.join("\n"));
                var A = ["#268bd2", "#dc322f", "#859900", "#b58900", "#6c71c4", "#d33682", "#2aa198"]
                  , C = $(c.canvas).offset();
                if (w.length > 0) {
                    var D = [];
                    $.each(w, function(a, b) {
                        try {
                            var c = g(b)
                        } catch (d) {
                            t.push(d)
                        }
                        c && D.push(c)
                    }
                    ),
                    D.add_plot = h;
                    var E = a.plot.graph(D);
                    if (f.report) {
                        var F = $('<button style="margin-left:10px">Stats</button>');
                        F.on("click", function() {
                            var b = $(c.canvas).offset();
                            b.top += 30,
                            b.left += 30,
                            a.window("Circuit statistics", f.report(), b)
                        }
                        ),
                        $(".plot-toolbar", E).append(F)
                    }
                    var I = a.window("Test Results: " + (t.length > 0 ? "errors detected" : "passed"), E, C)
                      , K = Math.floor(.75 * $(c.canvas).width())
                      , L = Math.min(200 * w.length, Math.floor(.75 * $(c.canvas).height()));
                    I[0].resize(K - I.width(), L - I.height()),
                    C.top += L + 10
                }
                if (t.length > 0) {
                    var M = "";
                    t.length > 5 && (t = t.slice(0, 5),
                    M = "<br>..."),
                    n = "<li>" + t.join("<li>") + M,
                    a.window("Errors detected by test", $('<div class="jade-alert"></div>').html(n), C),
                    m[d.get_name()] = "Error detected: " + n
                } else {
                    c.message("Test successful!");
                    var N = 1e-10 / (1e-12 * f._network_.size * f._network_.time);
                    m[d.get_name()] = "passed " + p + " " + o + " " + N.toString()
                }
                return void 0
            }
            return W[0].update_progress(b),
            W[0].stop_requested
        }
        function l(b, c) {
            var d = k(b, c);
            return void 0 === b && a.model.save_modules(!0),
            d
        }
        var m = c.editor.jade.configuration.tests;
        m[d.get_name()] = "Error detected: test did not yield a result.";
        var n, o, p = a.utils.md5(b);
        jade_defs.md5sum = p,
        b = b.replace(/\/\*(.|\n)*?\*\//g, ""),
        b = b.replace(/\/\/.*/g, "");
        var q, r, s, t, u = 1, v = "device", w = [], x = [], y = {}, z = [], A = {}, B = {}, C = [], D = {}, E = [], F = {}, G = {}, H = {}, I = [], J = [], K = c.editor.options || {};
        for (b = b.split("\n"),
        s = 0; s < b.length; s += 1) {
            var L = b[s].match(/([A-Za-z0-9_.:\[\]]+|=|-|,|\(|\))/g);
            if (null  !== L)
                if (".mode" == L[0])
                    2 != L.length ? I.push("Malformed .mode statement: " + b[s]) : "device" == L[1] || "gate" == L[1] ? v = L[1] : I.push("Unrecognized simulation mode: " + L[1]);
                else if (".options" == L[0])
                    for (q = 1; q < L.length; q += 3) {
                        if (q + 2 >= L.length || "=" != L[q + 1]) {
                            I.push("Malformed " + L[0] + " statement: " + b[s]);
                            break
                        }
                        if (t = a.utils.parse_number(L[q + 2]),
                        isNaN(t)) {
                            I.push('Unrecognized option value "' + L[q + 2] + '": ' + b[s]);
                            break
                        }
                        K[L[q].toLowerCase()] = t
                    }
                else if (".power" == L[0] || ".thresholds" == L[0])
                    for (q = 1; q < L.length; q += 3) {
                        if (q + 2 >= L.length || "=" != L[q + 1]) {
                            I.push("Malformed " + L[0] + " statement: " + b[s]);
                            break
                        }
                        if (t = a.utils.parse_number(L[q + 2]),
                        isNaN(t)) {
                            I.push('Unrecognized voltage specification "' + L[q + 2] + '": ' + b[s]);
                            break
                        }
                        ".power" == L[0] ? A[L[q].toLowerCase()] = t : B[L[q]] = t
                    }
                else if (".group" == L[0])
                    if (L.length < 3)
                        I.push("Malformed .group statement: " + b[s]);
                    else
                        for (D[L[1]] = [],
                        r = 2; r < L.length; r += 1)
                            $.each(a.utils.parse_signal(L[r]), function(a, b) {
                                D[L[1]].push(E.length),
                                E.push(b)
                            }
                            );
                else if (".plotdef" == L[0])
                    L = b[s].split(/\s+/),
                    L.length < 3 ? I.push("Malformed .plotdef statement: " + b[s]) : H[L[1]] = L.slice(2);
                else if (".plot" == L[0])
                    w.push(e(L.slice(1), I));
                else if (".cycle" == L[0]) {
                    if (0 != C.length) {
                        I.push("More than one .cycle statement: " + b[s]);
                        break
                    }
                    for (q = 1; q < L.length; )
                        if (("assert" == L[q] || "deassert" == L[q] || "sample" == L[q]) && q + 1 < L.length) {
                            var M = D[L[q + 1]];
                            if (void 0 === M) {
                                I.push('Use of undeclared group name "' + L[q + 1] + '" in .cycle: ' + b[s]);
                                break
                            }
                            for (r = 0; r < M.length; r += 1)
                                ("assert" == L[q] || "deassert" == L[q]) && (F[E[M[r]]] = [[0, "Z"]]),
                                "sample" == L[q] && (G[E[M[r]]] = []);
                            C.push([L[q], L[q + 1]]),
                            q += 2
                        } else if ("tran" == L[q] && q + 1 < L.length) {
                            if (t = a.utils.parse_number(L[q + 1]),
                            isNaN(t)) {
                                I.push('Unrecognized tran duration "' + L[q + 1] + '": ' + b[s]);
                                break
                            }
                            C.push(["tran", t]),
                            q += 2
                        } else if ("log" != L[q]) {
                            if (!("=" == L[q + 1] && q + 2 < L.length)) {
                                I.push('Malformed .cycle action "' + L[q] + '": ' + b[s]);
                                break
                            }
                            if (t = L[q + 2],
                            -1 == "01Z".indexOf(t)) {
                                I.push('Unrecognized value specification "' + L[q + 2] + '": ' + b[s]);
                                break
                            }
                            C.push(["set", L[q].toLowerCase(), t]),
                            F[L[q].toLowerCase()] = [[0, "Z"]],
                            q += 3
                        } else
                            C.push(["log"]),
                            q += 1
                } else if (".repeat" == L[0])
                    u = parseInt(L[1]),
                    (isNaN(u) || 1 > u) && (I.push("Expected positive integer for .repeat: " + L[1]),
                    u = 1);
                else if (".log" == L[0])
                    for (r = 1; r < L.length; r += 1)
                        $.each(a.utils.parse_signal(L[r]), function(a, b) {
                            J.push(b)
                        }
                        );
                else if (".mverify" == L[0])
                    if (L.length < 4)
                        I.push("Malformed .mverify statement: " + b[s]);
                    else {
                        var N = parseInt(L[2]);
                        if (isNaN(N))
                            I.push('Bad location "' + L[2] + '" in .mverify statement: ' + b[s]);
                        else {
                            var O = y[L[1].toLowerCase()];
                            for (void 0 === O && (O = [],
                            y[L[1].toLowerCase()] = O),
                            r = 3; r < L.length; r += 1)
                                t = parseInt(L[r]),
                                isNaN(t) ? I.push('Bad value "' + L[r] + '" in .mverify statement: ' + b[s]) : (O[N] = t,
                                N += 1);
                            z.push(b[s])
                        }
                    }
                else if ("." == L[0][0])
                    I.push("Unrecognized control statment: " + b[s]);
                else {
                    var P = L.join("");
                    if (P.length != E.length) {
                        I.push("Test line does not specify " + E.length + " signals: " + b[s]);
                        break
                    }
                    for (r = 0; r < P.length; r += 1)
                        if (-1 == "01ZLH-".indexOf(P[r])) {
                            I.push("Illegal test value " + P[r] + ": " + b[s]);
                            break
                        }
                    for (; u--; )
                        x.push(P);
                    u = 1
                }
        }
        if ("Vol" in B || I.push("Missing Vol threshold specification"),
        "Vil" in B || I.push("Missing Vil threshold specification"),
        "Vih" in B || I.push("Missing Vih threshold specification"),
        "Voh" in B || I.push("Missing Voh threshold specification"),
        0 == C.length && I.push("Missing .cycle specification"),
        0 == x.length && I.push("No tests specified!"),
        0 != I.length)
            return n = "<li>" + I.join("<li>"),
            a.window("Errors in test specification", $('<div class="jade-alert"></div>').html(n), $(c.canvas).offset()),
            void (m[d.get_name()] = "Error detected: invalid test specification" + n);
        if (!d.has_aspect("schematic"))
            return c.message("This module does not have a schematic!"),
            void (m[d.get_name()] = "Error detected: this module has no schematic!");
        var Q;
        try {
            var R = Object.getOwnPropertyNames(A);
            if (R.push("gnd"),
            "device" == v)
                Q = a.device_level.diagram_device_netlist(c, R);
            else {
                if ("gate" != v)
                    throw "Unrecognized simulation mode: " + v;
                Q = a.gate_level.diagram_gate_netlist(c, R)
            }
        } catch (S) {
            return S.stack && console.log(S.stack),
            a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(S), $(c.canvas).offset()),
            void (m[d.get_name()] = "Error detected extracting netlist:<p>" + S)
        }
        var T = a.netlist.extract_nodes(Q);
        if ($.each(F, f),
        $.each(G, f),
        $.each(J, function(a, b) {
            f(b)
        }
        ),
        0 != I.length)
            return n = "<li>" + I.join("<li>"),
            a.window("Errors in test specification", $('<div class="jade-alert"></div>').html(n), $(c.canvas).offset()),
            void (m[d.get_name()] = "Error detected:" + n);
        Q.push({
            type: "ground",
            connections: ["gnd"],
            properties: {}
        }),
        $.each(A, function(a, b) {
            Q.push({
                type: "voltage source",
                connections: {
                    nplus: a,
                    nminus: "gnd"
                },
                properties: {
                    value: {
                        type: "dc",
                        args: [b]
                    },
                    name: a
                }
            })
        }
        );
        var U = 0
          , V = [];
        if ($.each(x, function(a, b) {
            $.each(C, function(c, d) {
                "assert" == d[0] || "deassert" == d[0] ? $.each(D[d[1]], function(a, c) {
                    ("deassert" == d[0] || -1 != "01Z".indexOf(b[c])) && i(F[E[c]], "deassert" == d[0] ? "Z" : b[c])
                }
                ) : "sample" == d[0] ? $.each(D[d[1]], function(c, d) {
                    -1 != "HL".indexOf(b[d]) && G[E[d]].push({
                        t: U,
                        v: b[d],
                        i: a + 1
                    })
                }
                ) : "set" == d[0] ? i(F[d[1]], d[2]) : "log" == d[0] ? V.push(U) : "tran" == d[0] && (U += d[1])
            }
            )
        }
        ),
        "device" == v)
            g(Q, F, B);
        else {
            if ("gate" != v)
                throw "Unrecognized simulation mode: " + v;
            h(Q, F, B)
        }
        var W = a.progress_report();
        a.window("Progress", W[0], $(c.canvas).offset());
        try {
            if ("device" == v)
                a.cktsim.transient_analysis(Q, U, Object.keys(G), l, K);
            else {
                if ("gate" != v)
                    throw "Unrecognized simulation mode: " + v;
                a.gatesim.transient_analysis(Q, U, Object.keys(G), l, K)
            }
        } catch (S) {
            return a.window_close(W[0].win),
            S.stack && console.log(S.stack),
            a.window("Error running test", $('<div class="jade-alert"></div>').html(S), $(c.canvas).offset()),
            void (m[d.get_name()] = "Error detected running simulation:<p>" + S)
        }
    }
    function g(a, b, c) {
        a.push({
            type: "voltage source",
            connections: {
                nplus: "_voh_",
                nminus: "gnd"
            },
            properties: {
                name: "_voh_source",
                value: {
                    type: "dc",
                    args: [c.Voh]
                }
            }
        }),
        a.push({
            type: "voltage source",
            connections: {
                nplus: "_vol_",
                nminus: "gnd"
            },
            properties: {
                name: "_vol_source",
                value: {
                    type: "dc",
                    args: [c.Vol]
                }
            }
        }),
        $.each(b, function(b) {
            a.push({
                type: "pfet",
                connections: {
                    d: "_voh_",
                    g: b + "_pullup",
                    s: b
                },
                properties: {
                    W: 100,
                    L: 1,
                    name: b + "_pullup"
                }
            }),
            a.push({
                type: "nfet",
                connections: {
                    d: b,
                    g: b + "_pulldown",
                    s: "_vol_"
                },
                properties: {
                    W: 100,
                    L: 1,
                    name: b + "_pulldown"
                }
            })
        }
        ),
        $.each(b, function(b, d) {
            var e = [0, c.Vol]
              , f = [0, c.Voh];
            $.each(d, function(a, g) {
                var h, i, j = g[0], k = g[1];
                "0" == k ? (i = c.Voh,
                h = c.Voh) : "1" == k ? (i = c.Vol,
                h = c.Vol) : "Z" == k ? (i = c.Vol,
                h = c.Voh) : console.log("node: " + b + ", tvlist: " + JSON.stringify(d));
                var l = f[f.length - 1];
                l != h && (j != f[f.length - 2] && f.push.apply(f, [j, l]),
                f.push.apply(f, [j + 1e-10, h]));
                var m = e[e.length - 1];
                m != i && (j != e[e.length - 2] && e.push.apply(e, [j, m]),
                e.push.apply(e, [j + 1e-10, i]))
            }
            ),
            a.push({
                type: "voltage source",
                connections: {
                    nplus: b + "_pullup",
                    nminus: "gnd"
                },
                properties: {
                    name: b + "_pullup_source",
                    value: {
                        type: "pwl",
                        args: f
                    }
                }
            }),
            a.push({
                type: "voltage source",
                connections: {
                    nplus: b + "_pulldown",
                    nminus: "gnd"
                },
                properties: {
                    name: b + "_pulldown_source",
                    value: {
                        type: "pwl",
                        args: e
                    }
                }
            })
        }
        )
    }
    function h(a, b, c) {
        $.each(b, function(b) {
            a.push({
                type: "tristate",
                connections: {
                    e: b + "_enable",
                    a: b + "_data",
                    z: b
                },
                properties: {
                    name: b + "_input_driver",
                    tcd: 0,
                    tpd: 1e-10,
                    tr: 0,
                    tf: 0,
                    cin: 0,
                    size: 0
                }
            })
        }
        ),
        $.each(b, function(b, d) {
            var e = [0, c.Vol]
              , f = [0, c.Vol];
            $.each(d, function(a, g) {
                var h, i, j = g[0], k = g[1];
                "0" == k ? (h = c.Voh,
                i = c.Vol) : "1" == k ? (h = c.Voh,
                i = c.Voh) : "Z" == k || "-" == k ? (h = c.Vol,
                i = c.Vol) : console.log("node: " + b + ", tvlist: " + JSON.stringify(d));
                var l = e[e.length - 1];
                l != h && (j != e[e.length - 2] && e.push.apply(e, [j, l]),
                e.push.apply(e, [j + 1e-10, h]));
                var m = f[f.length - 1];
                m != i && (j != f[f.length - 2] && f.push.apply(f, [j, m]),
                f.push.apply(f, [j + 1e-10, i]))
            }
            ),
            a.push({
                type: "voltage source",
                connections: {
                    nplus: b + "_enable",
                    nminus: "gnd"
                },
                properties: {
                    name: b + "_enable_source",
                    value: {
                        type: "pwl",
                        args: e
                    }
                }
            }),
            a.push({
                type: "voltage source",
                connections: {
                    nplus: b + "_data",
                    nminus: "gnd"
                },
                properties: {
                    name: b + "_data_source",
                    value: {
                        type: "pwl",
                        args: f
                    }
                }
            })
        }
        )
    }
    return a.schematic_view.schematic_tools.push(["check", a.icons.check_icon, "Check: run tests", b]),
    c.prototype.resize = function(a, b) {
        var c = this.textarea
          , d = c.outerWidth(!0) - c.width()
          , e = c.outerHeight(!0) - c.height()
          , f = a - d
          , g = b - e;
        c.width(f),
        c.height(g)
    }
    ,
    c.prototype.show = function() {}
    ,
    c.prototype.set_aspect = function(b) {
        this.module = b,
        this.aspect = b.aspect("test"),
        this.test_component = this.aspect.components[0],
        void 0 === this.test_component && (this.test_component = a.model.make_component(["test", ""]),
        this.aspect.add_component(this.test_component)),
        this.textarea.val(this.test_component.test),
        $(this.tab).html(c.prototype.editor_name),
        this.aspect.read_only() ? (this.textarea.attr("disabled", "disabled"),
        $(this.tab).append(" " + a.icons.readonly)) : this.textarea.removeAttr("disabled")
    }
    ,
    c.prototype.event_coords = function() {}
    ,
    c.prototype.check = function() {
        f(this.textarea.val(), this, this.module)
    }
    ,
    c.prototype.message = function(a) {
        this.status.text(a)
    }
    ,
    c.prototype.clear_message = function(a) {
        this.status.text() == a && this.status.text("")
    }
    ,
    c.prototype.editor_name = "test",
    a.editors.push(c),
    d.prototype = new a.model.Component,
    d.prototype.constructor = d,
    d.prototype.type = function() {
        return "test"
    }
    ,
    a.model.built_in_components.test = d,
    d.prototype.load = function(a) {
        this.test = a[1]
    }
    ,
    d.prototype.json = function() {
        return [this.type(), this.test]
    }
    ,
    {}
}
,
jade_defs.utils = function() {
    function a(a) {
        return "" == a || m.test(a)
    }
    function b(a) {
        if ("" == a)
            return !0;
        for (var b = a.split(","), c = 0; c < b.length; c += 1) {
            var d = b[c].trim();
            if (!o.test(d) && !n.test(d))
                return !1
        }
        return !0
    }
    function c(a, b) {
        var c;
        if (c = a.match(/^\s*([\-+]?)0x([0-9a-fA-F]+)\s*$/))
            return parseInt(c[1] + c[2], 16);
        if (c = a.match(/^\s*([\-+]?)0b([0-1]+)\s*$/))
            return parseInt(c[1] + c[2], 2);
        if (c = a.match(/^\s*([\-+]?)0([0-7]+)\s*$/))
            return parseInt(c[1] + c[2], 8);
        if (c = a.match(/^\s*[\-+]?[0-9]*(\.([0-9]+)?)?([eE][\-+]?[0-9]+)?\s*$/))
            return parseFloat(c[0]);
        if (c = a.match(/^\s*([\-+]?[0-9]*(\.([0-9]+)?)?)(a|A|f|F|g|G|k|K|m|M|n|N|p|P|t|T|u|U)\s*$/)) {
            var d = parseFloat(c[1])
              , e = c[4];
            return "P" == e ? d *= 1e15 : "t" == e || "T" == e ? d *= 1e12 : "g" == e || "G" == e ? d *= 1e9 : "M" == e ? d *= 1e6 : "k" == e || "K" == e ? d *= 1e3 : "m" == e ? d *= .001 : "u" == e || "U" == e ? d *= 1e-6 : "n" == e || "N" == e ? d *= 1e-9 : "p" == e ? d *= 1e-12 : "f" == e || "F" == e ? d *= 1e-15 : ("a" == e || "A" == e) && (d *= 1e-18),
            d
        }
        return b || 0 / 0
    }
    function d(a) {
        var b = c(a, void 0);
        if (void 0 === b)
            throw 'The string "' + a + '" could not be interpreted as an integer, a floating-point number or a number using engineering notation. Sorry, expressions are not allowed in this context.';
        return b
    }
    function e(a) {
        a = a.replace(/\/\*(.|\n)*?\*\//g, ""),
        a = a.replace(/\/\/.*/g, ""),
        a = a.replace(/[+_]/g, ""),
        a = a.replace(/\?/g, "0");
        for (var b = a.split(/\s+/), d = [], e = 0, f = 0; f < b.length; f += 1)
            "" != b[f] && ("@" == b[f][0] ? e = c(b[f].substr(1)) : (d[e] = c(b[f]),
            e += 1));
        return d
    }
    function f(a, b, c) {
        if (0 === a)
            return "0";
        if (void 0 === a)
            return "undefined";
        void 0 === c && (c = !0);
        var d = 0 > a ? -1 : 1
          , e = Math.log(d * a) / Math.LN10
          , f = Math.floor(e / 3)
          , g = d * Math.pow(10, e - 3 * f)
          , h = (g + .5 * d * Math.pow(10, -b)).toString()
          , i = h.length
          , j = h.indexOf(".");
        if (-1 != j) {
            if (b > 0 && (j += b + 1,
            j > i && (j = i),
            c)) {
                for (; "0" == h.charAt(j - 1); )
                    j -= 1;
                "." == h.charAt(j - 1) && (j -= 1)
            }
            i > j && (h = h.substring(0, j))
        }
        switch (f) {
        case -5:
            return h + "f";
        case -4:
            return h + "p";
        case -3:
            return h + "n";
        case -2:
            return h + "u";
        case -1:
            return h + "m";
        case 0:
            return h;
        case 1:
            return h + "K";
        case 2:
            return h + "M";
        case 3:
            return h + "G"
        }
        return a.toPrecision(b)
    }
    function g(a) {
        var b = {};
        if (b.period = 0,
        b.value = function() {
            return 0
        }
        ,
        b.inflection_point = function() {
            return void 0
        }
        ,
        "string" == typeof a) {
            var c = a.match(/^\s*(\w+)\s*\(([^\)]*)\)\s*$/);
            c ? (b.fun = c[1],
            b.args = c[2].split(/\s*,\s*/).map(d)) : (b.fun = "dc",
            b.args = [d(a)])
        } else
            b.fun = a.type,
            b.args = a.args;
        var e, f, g, j, k, l, m, n, o, p, q, r, s, t, u, v, w;
        if ("dc" == b.fun)
            e = i(b.args, 0, 0),
            b.args = [e],
            b.value = function() {
                return e
            }
            ;
        else if ("impulse" == b.fun)
            e = i(b.args, 0, 1),
            f = Math.abs(i(b.args, 2, 1e-9)),
            b.args = [e, f],
            h(b, [0, 0, f / 2, e, f, 0], !1);
        else if ("step" == b.fun)
            e = i(b.args, 0, 0),
            f = i(b.args, 1, 1),
            k = Math.max(0, i(b.args, 2, 0)),
            l = Math.abs(i(b.args, 3, 1e-9)),
            b.args = [e, f, k, l],
            h(b, [k, e, k + l, f], !1);
        else if ("square" == b.fun)
            e = i(b.args, 0, 0),
            f = i(b.args, 1, 1),
            n = Math.abs(i(b.args, 2, 1)),
            o = Math.min(100, Math.abs(i(b.args, 3, 50))),
            r = Math.abs(i(b.args, 4, 1e-10)),
            b.args = [e, f, n, o, r],
            q = 0 === n ? 1 / 0 : 1 / n,
            p = .01 * o * (q - 2 * r),
            h(b, [0, e, p, e, p + r, f, 2 * p + r, f, 2 * r + 2 * p, e, q, e], !0);
        else if ("clock" == b.fun)
            e = i(b.args, 0, 0),
            f = i(b.args, 1, 1),
            q = Math.abs(i(b.args, 2, 1e-7)),
            o = Math.min(100, Math.abs(i(b.args, 3, 50))),
            r = Math.abs(i(b.args, 4, 1e-10)),
            b.args = [e, f, q, o, r],
            p = .01 * o * (q - 2 * r),
            h(b, [0, e, p, e, p + r, f, 2 * p + r, f, 2 * r + 2 * p, e, q, e], !0);
        else if ("triangle" == b.fun)
            e = i(b.args, 0, 0),
            f = i(b.args, 1, 1),
            n = Math.abs(i(b.args, 2, 1)),
            b.args = [e, f, n],
            q = 0 === n ? 1 / 0 : 1 / n,
            h(b, [0, e, q / 2, f, q, e], !0);
        else if ("pwl" == b.fun || "pwl_repeating" == b.fun)
            h(b, b.args, "pwl_repeating" == b.fun);
        else if ("pulse" == b.fun)
            e = i(b.args, 0, 0),
            f = i(b.args, 1, 1),
            k = Math.max(0, i(b.args, 2, 0)),
            l = Math.abs(i(b.args, 3, 1e-9)),
            m = Math.abs(i(b.args, 4, 1e-9)),
            p = Math.abs(i(b.args, 5, 1e9)),
            q = Math.abs(i(b.args, 6, 1e9)),
            b.args = [e, f, k, l, m, p, q],
            s = k,
            t = s + l,
            u = t + p,
            v = u + m,
            h(b, [s, e, t, f, u, f, v, e, q, e], !0);
        else {
            if ("sin" != b.fun)
                throw "Unrecognized source function " + b.fun;
            g = i(b.args, 0, 0),
            j = i(b.args, 1, 1),
            n = Math.abs(i(b.args, 2, 1)),
            b.period = 1 / n,
            k = Math.max(0, i(b.args, 3, 0)),
            w = i(b.args, 4, 0),
            b.args = [g, j, n, k, w],
            w /= 360,
            b.value = function(a) {
                return k > a ? g + j * Math.sin(2 * Math.PI * w) : g + j * Math.sin(2 * Math.PI * (n * (a - k) + w))
            }
            ,
            b.inflection_point = function(a) {
                return k > a ? k : void 0
            }
        }
        return b.dc = b.value(0),
        b
    }
    function h(a, b, c) {
        var d = b.length;
        a.tvpairs = b,
        a.period = c ? b[d - 2] : 0,
        d % 2 == 1 && (d -= 1),
        2 >= d ? (a.value = function() {
            return 2 == d ? b[1] : 0
        }
        ,
        a.inflection_point = function() {
            return void 0
        }
        ) : (a.value = function(a) {
            c && (a = Math.fmod(a, b[d - 2]));
            var e = b[0]
              , f = b[1];
            if (a > e)
                for (var g, h, i = 2; d > i; i += 2) {
                    if (g = b[i],
                    h = b[i + 1],
                    g > e && g > a)
                        return f + (h - f) * (a - e) / (g - e);
                    e = g,
                    f = h
                }
            return f
        }
        ,
        a.inflection_point = function(a) {
            c && (a = Math.fmod(a, b[d - 2]));
            for (var e = 0; d > e; e += 2) {
                var f = b[e];
                if (f > a)
                    return f
            }
            return void 0
        }
        )
    }
    function i(a, b, c) {
        var d = a[b];
        return void 0 === d && (d = c),
        d
    }
    function j(a, b) {
        if (a.length == b.length) {
            for (var c = 0; c < a.length; c += 1)
                if (a[c] != b[c])
                    return !1;
            return !0
        }
        return !1
    }
    function k(a) {
        function b(a) {
            var d, e = [];
            if (n.test(a)) {
                d = a.match(/(.*)'([1-9]\d*)$/);
                for (var f = c(d[1]), g = parseInt(d[2], 10), h = g - 1; h >= 0; h -= 1)
                    e.push(0 !== (f & 1 << h) ? "vdd" : "gnd");
                return e
            }
            if (d = a.match(/(.*)#\s*(\d+)$/)) {
                var i = b(d[1].trim())
                  , j = parseInt(d[2], 10);
                if (isNaN(j))
                    return [a];
                for (; j > 0; )
                    e.push.apply(e, i),
                    j -= 1;
                return e
            }
            if (d = a.match(/(.*)\[\s*(\-?\d+)\s*:\s*(\-?\d+)\s*(:\s*(\-?\d+)\s*)?\]$/)) {
                var i = b(d[1].trim())
                  , k = parseInt(d[2], 10)
                  , l = parseInt(d[3], 10)
                  , m = Math.abs(parseInt(d[5], 10) || 1);
                for (k > l && (m = -m); ; ) {
                    for (var o = 0; o < i.length; o += 1)
                        e.push(i[o] + "[" + k.toString() + "]");
                    if (k += m,
                    m > 0 && k > l || 0 > m && l > k)
                        break
                }
                return e
            }
            return a ? [a.toLowerCase()] : []
        }
        var d = [];
        if (void 0 !== a)
            for (var e = a.split(","), f = 0; f < e.length; f += 1) {
                var g = b(e[f].trim());
                d.push.apply(d, g)
            }
        return d
    }
    function l(a) {
        function b(a, b) {
            return a + b & 4294967295
        }
        function c(a, c, d, e, f, g) {
            return c = b(b(c, a), b(e, g)),
            b(c << f | c >>> 32 - f, d)
        }
        function d(a, b, d, e, f, g, h) {
            return c(b & d | ~b & e, a, b, f, g, h)
        }
        function e(a, b, d, e, f, g, h) {
            return c(b & e | d & ~e, a, b, f, g, h)
        }
        function f(a, b, d, e, f, g, h) {
            return c(b ^ d ^ e, a, b, f, g, h)
        }
        function g(a, b, d, e, f, g, h) {
            return c(d ^ (b | ~e), a, b, f, g, h)
        }
        function h(a, c) {
            var h = a[0]
              , i = a[1]
              , j = a[2]
              , k = a[3];
            h = d(h, i, j, k, c[0], 7, -680876936),
            k = d(k, h, i, j, c[1], 12, -389564586),
            j = d(j, k, h, i, c[2], 17, 606105819),
            i = d(i, j, k, h, c[3], 22, -1044525330),
            h = d(h, i, j, k, c[4], 7, -176418897),
            k = d(k, h, i, j, c[5], 12, 1200080426),
            j = d(j, k, h, i, c[6], 17, -1473231341),
            i = d(i, j, k, h, c[7], 22, -45705983),
            h = d(h, i, j, k, c[8], 7, 1770035416),
            k = d(k, h, i, j, c[9], 12, -1958414417),
            j = d(j, k, h, i, c[10], 17, -42063),
            i = d(i, j, k, h, c[11], 22, -1990404162),
            h = d(h, i, j, k, c[12], 7, 1804603682),
            k = d(k, h, i, j, c[13], 12, -40341101),
            j = d(j, k, h, i, c[14], 17, -1502002290),
            i = d(i, j, k, h, c[15], 22, 1236535329),
            h = e(h, i, j, k, c[1], 5, -165796510),
            k = e(k, h, i, j, c[6], 9, -1069501632),
            j = e(j, k, h, i, c[11], 14, 643717713),
            i = e(i, j, k, h, c[0], 20, -373897302),
            h = e(h, i, j, k, c[5], 5, -701558691),
            k = e(k, h, i, j, c[10], 9, 38016083),
            j = e(j, k, h, i, c[15], 14, -660478335),
            i = e(i, j, k, h, c[4], 20, -405537848),
            h = e(h, i, j, k, c[9], 5, 568446438),
            k = e(k, h, i, j, c[14], 9, -1019803690),
            j = e(j, k, h, i, c[3], 14, -187363961),
            i = e(i, j, k, h, c[8], 20, 1163531501),
            h = e(h, i, j, k, c[13], 5, -1444681467),
            k = e(k, h, i, j, c[2], 9, -51403784),
            j = e(j, k, h, i, c[7], 14, 1735328473),
            i = e(i, j, k, h, c[12], 20, -1926607734),
            h = f(h, i, j, k, c[5], 4, -378558),
            k = f(k, h, i, j, c[8], 11, -2022574463),
            j = f(j, k, h, i, c[11], 16, 1839030562),
            i = f(i, j, k, h, c[14], 23, -35309556),
            h = f(h, i, j, k, c[1], 4, -1530992060),
            k = f(k, h, i, j, c[4], 11, 1272893353),
            j = f(j, k, h, i, c[7], 16, -155497632),
            i = f(i, j, k, h, c[10], 23, -1094730640),
            h = f(h, i, j, k, c[13], 4, 681279174),
            k = f(k, h, i, j, c[0], 11, -358537222),
            j = f(j, k, h, i, c[3], 16, -722521979),
            i = f(i, j, k, h, c[6], 23, 76029189),
            h = f(h, i, j, k, c[9], 4, -640364487),
            k = f(k, h, i, j, c[12], 11, -421815835),
            j = f(j, k, h, i, c[15], 16, 530742520),
            i = f(i, j, k, h, c[2], 23, -995338651),
            h = g(h, i, j, k, c[0], 6, -198630844),
            k = g(k, h, i, j, c[7], 10, 1126891415),
            j = g(j, k, h, i, c[14], 15, -1416354905),
            i = g(i, j, k, h, c[5], 21, -57434055),
            h = g(h, i, j, k, c[12], 6, 1700485571),
            k = g(k, h, i, j, c[3], 10, -1894986606),
            j = g(j, k, h, i, c[10], 15, -1051523),
            i = g(i, j, k, h, c[1], 21, -2054922799),
            h = g(h, i, j, k, c[8], 6, 1873313359),
            k = g(k, h, i, j, c[15], 10, -30611744),
            j = g(j, k, h, i, c[6], 15, -1560198380),
            i = g(i, j, k, h, c[13], 21, 1309151649),
            h = g(h, i, j, k, c[4], 6, -145523070),
            k = g(k, h, i, j, c[11], 10, -1120210379),
            j = g(j, k, h, i, c[2], 15, 718787259),
            i = g(i, j, k, h, c[9], 21, -343485551),
            a[0] = b(h, a[0]),
            a[1] = b(i, a[1]),
            a[2] = b(j, a[2]),
            a[3] = b(k, a[3])
        }
        function i(a) {
            for (var b = [1732584193, -271733879, -1732584194, 271733878], c = a.length, d = 64; c >= d; d += 64)
                h(b, j(a.substring(d - 64, d)));
            a = a.substring(d - 64);
            var e = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            for (d = 0; c > d; d++)
                e[d >> 2] |= a.charCodeAt(d) << (d % 4 << 3);
            if (e[d >> 2] |= 128 << (d % 4 << 3),
            d > 55)
                for (h(b, e),
                d = 0; 16 > d; d++)
                    e[d] = 0;
            return e[14] = 8 * c,
            h(b, e),
            b
        }
        function j(a) {
            for (var b = [], c = 0; 64 > c; c += 4)
                b[c >> 2] = a.charCodeAt(c) + (a.charCodeAt(c + 1) << 8) + (a.charCodeAt(c + 2) << 16) + (a.charCodeAt(c + 3) << 24);
            return b
        }
        function k(a) {
            for (var b = "", c = 0; 4 > c; c++)
                b += m[a >> 8 * c + 4 & 15] + m[a >> 8 * c & 15];
            return b
        }
        function l(a) {
            for (var b = 0; b < a.length; b++)
                a[b] = k(a[b]);
            return a.join("")
        }
        var m = "0123456789abcdef".split("");
        return l(i(a))
    }
    var m = /^[A-Za-z_/][A-Za-z_/0-9]*$/
      , n = /^[\-+]?(0x[0-9a-fA-F]+|0b[01]+|0[0-7]+|[0-9]+)'([1-9]\d*)$/
      , o = /^[A-Za-z_]([A-Za-z0-9_]|\[\d+(\:\d+(\:\d+)?)?\])*(\#\d+)?$/;
    return Math.fmod = function(a, b) {
        var c = Math.floor(a / b);
        return a - c * b
    }
    ,
    {
        parse_number: c,
        parse_number_alert: d,
        parse_nlist: e,
        engineering_notation: f,
        validate_name: a,
        validate_signal: b,
        parse_source: g,
        parse_signal: k,
        signal_equals: j,
        md5: l
    }
}
,
jade_defs.plot = function(a) {
    function b(a, b, c) {
        var d, e = Math.log((b - a) / Math.max(1, c)) / Math.LN10, f = Math.floor(e), g = Math.pow(10, e - f);
        d = g >= 4.99 ? 5 : g >= 1.99 ? 2 : 1,
        d *= Math.pow(10, f);
        var h = Math.floor(a / d) * d;
        return a > h && (h += d),
        [h, d]
    }
    function c(a) {
        function b(b, c) {
            a.sel0 = void 0,
            void 0 === c && (c = a[0].left);
            var e = a[0]
              , f = e.datax(c)
              , g = f - (c - e.left) / e.wplot * b;
            a.xstart = Math.max(a.xmin, g),
            a.xend = a.xstart + b,
            a.xend > a.xmax && (a.xstart = Math.max(a.xmin, a.xstart - (a.xend - a.xmax)),
            a.xend = a.xmax),
            d(h[0], h.width(), h.height())
        }
        function c(c) {
            c.dataseries = a,
            $.each(c.xvalues, function(b, c) {
                (void 0 === a.xmin || c[0] < a.xmin) && (a.xmin = c[0]),
                (void 0 === a.xmax || c[c.length - 1] > a.xmax) && (a.xmax = c[c.length - 1])
            }
            );
            var e, i;
            if ($.each(c.yvalues, function(a, b) {
                "analog" == c.type[a] && $.each(b, function(a, b) {
                    (void 0 === e || e > b) && (e = b),
                    (void 0 === i || b > i) && (i = b)
                }
                )
            }
            ),
            void 0 === e && (e = 0,
            i = 1),
            e == i)
                0 === e ? (e = -.5,
                i = .5) : (e = e > 0 ? .9 * e : 1.1 * e,
                i = i > 0 ? 1.1 * i : .9 * i);
            else {
                var j = .2 * (i - e);
                e -= j,
                i += j
            }
            c.ymin = e,
            c.ymax = i,
            c.canvas = $('<canvas class="plot-canvas"></canvas>'),
            c.canvas[0].plot_dataset = c,
            c.canvas.on("click", function(b) {
                var e = c.canvas.offset()
                  , f = b.pageX - e.left
                  , g = b.pageY - e.top;
                f >= 5.5 && 15.5 >= f && g >= 5.5 && 15.5 >= g && (a.splice(a.indexOf(c), 1),
                c.canvas.remove(),
                d(h[0], h.width(), h.height()),
                b.preventDefault())
            }
            ),
            c.canvas.on("dblclick", function(a) {
                var d = c.canvas.offset()
                  , e = a.pageX - d.left
                  , f = a.pageY - d.top;
                if (e >= c.left && e <= c.left + c.wplot && f >= c.top && f <= c.top + c.hplot) {
                    var g = c.dataseries.xend - c.dataseries.xstart;
                    a.shiftKey ? b(2 * g, e) : b(g / 2, e),
                    a.preventDefault()
                }
            }
            ),
            c.canvas.on("mouseenter", function() {
                c.canvas.focus()
            }
            ),
            c.canvas.on("mouseleave", function() {
                c.canvas.blur()
            }
            ),
            c.canvas.on("keypress", function(a) {
                if (37 == a.which)
                    g(1);
                else {
                    if (39 != a.which)
                        return;
                    g(-1)
                }
                a.prevent_default()
            }
            ),
            c.canvas.on("mousewheel", function(a) {
                var b = c.canvas.offset()
                  , d = a.pageX - b.left
                  , e = a.pageY - b.top;
                d >= c.left && d <= c.left + c.wplot && e >= c.top && e <= c.top + c.hplot && (a.preventDefault(),
                g(a.originalEvent.wheelDelta > 0 ? -1 : 1),
                a.preventDefault())
            }
            ),
            c.canvas.on("mousedown", function(b) {
                var d = c.canvas.offset()
                  , e = b.pageX - d.left
                  , g = b.pageY - d.top;
                e >= c.left && e <= c.left + c.wplot && g >= c.top && g <= c.top + c.hplot && (a.sel0 = a.cursor,
                a.sel1 = void 0,
                a.sel = !0,
                b.preventDefault()),
                $(document).on("mouseup", function(b) {
                    $(document).unbind("mouseup"),
                    a.sel = void 0,
                    f(a),
                    b.preventDefault()
                }
                )
            }
            ),
            c.canvas.on("mousemove", function(b) {
                var d = c.canvas.offset()
                  , e = b.pageX - d.left
                  , g = b.pageY - d.top;
                e >= c.left && e <= c.left + c.wplot && g >= c.top && g <= c.top + c.hplot ? (a.cursor = Math.floor(e) + .5,
                a.sel && (a.sel1 = a.cursor),
                f(a),
                b.preventDefault()) : a.cursor && (a.cursor = void 0,
                f(a))
            }
            ),
            c.bg_image = $("<canvas></canvas>");
            var k = c.canvas[0].getContext("2d")
              , l = window.devicePixelRatio || 1
              , m = k.webkitBackingStorePixelRatio || k.mozBackingStorePixelRatio || k.msBackingStorePixelRatio || k.oBackingStorePixelRatio || k.backingStorePixelRatio || 1;
            c.pixelRatio = l / m,
            s.append(c.canvas)
        }
        function g(b) {
            if (!t.is(":hidden")) {
                var c = (a.xmax - a.xmin) / u.width()
                  , d = a.xend - a.xstart;
                a.xstart = Math.max(a.xmin, a.xstart + b * c),
                a.xend = a.xstart + d,
                a.xend > a.xmax && (a.xend = a.xmax,
                a.xstart = a.xend - d),
                t.css("margin-left", (a.xstart - a.xmin) / c),
                $.each(a, function(a, b) {
                    e(b)
                }
                ),
                f(a)
            }
        }
        var h = $('<div class="plot-container noselect"></div>');
        h[0].dataseries = a,
        a.container = h[0];
        var i = $('<div class="plot-toolbar"></div>')
          , j = $('<img class="plot-tool" id="zoom">').attr("src", o)
          , k = $('<img class="plot-tool plot-tool-enabled" id="zoomin">').attr("src", p)
          , l = $('<img class="plot-tool" id="zoomout">').attr("src", q)
          , m = $('<img class="plot-tool" id="zoomsel">').attr("src", r);
        if (i.append(j, k, l, m),
        a.add_plot) {
            i.append('<div class="plot-tool-spacer"></div>Add plot: ');
            var n = $('<input type="text" size="20" style="margin-bottom:0" id="add-plot">');
            i.append(n),
            n.on("keypress", function(b) {
                13 == b.which && (a.add_plot(n.val()),
                $.each(a, function(a, b) {
                    void 0 === b.dataseries && c(b)
                }
                ),
                d(h[0], h.width(), h.height()))
            }
            )
        }
        h.append(i);
        var s = $('<div class="plot-waveforms"></div>');
        h.append(s),
        h.append('<div class="plot-scrollbar-wrapper"><div class="plot-scrollbar"><div class="plot-scrollbar-thumb"></div></div></div>'),
        j.on("click", function(b) {
            j.hasClass("plot-tool-enabled") && (a.sel0 = void 0,
            a.xstart = a.xmin,
            a.xend = a.xmax,
            d(h[0], h.width(), h.height()),
            b.preventDefault())
        }
        ),
        k.on("click", function(c) {
            k.hasClass("plot-tool-enabled") && b((a.xend - a.xstart) / 2),
            c.preventDefault()
        }
        ),
        l.on("click", function(c) {
            l.hasClass("plot-tool-enabled") && b(2 * (a.xend - a.xstart)),
            c.preventDefault()
        }
        ),
        m.on("click", function(b) {
            if (m.hasClass("plot-tool-enabled") && a.sel0 && a.sel1) {
                var c = a[0].datax(a.sel0)
                  , e = a[0].datax(a.sel1);
                a.xstart = Math.min(c, e),
                a.xend = Math.max(c, e),
                a.sel0 = void 0,
                a.sel1 = void 0,
                d(h[0], h.width(), h.height())
            }
            b.preventDefault()
        }
        ),
        $.each(a, function(a, b) {
            c(b)
        }
        ),
        a.xstart = a.xmin,
        a.xend = a.xmax,
        a.cursor = void 0;
        var t = h.find(".plot-scrollbar-thumb")
          , u = h.find(".plot-scrollbar");
        return t.on("click", function(a) {
            a.stopPropagation()
        }
        ),
        u.on("click", function(a) {
            var b = a.pageX - t.offset().left
              , c = .8 * t.width();
            g(0 > b ? -c : c),
            a.preventDefault()
        }
        ),
        t.on("mousedown", function(a) {
            var b = a.pageX;
            $(document).on("mousemove", function(a) {
                g(a.pageX - b),
                b = a.pageX,
                a.preventDefault()
            }
            ),
            $(document).on("mouseup", function(a) {
                $(document).unbind("mousemove"),
                $(document).unbind("mouseup"),
                a.preventDefault()
            }
            ),
            a.preventDefault()
        }
        ),
        h[0].resize = d,
        d(h[0], 400, 300),
        h[0]
    }
    function d(a, b, c) {
        var d = a.dataseries
          , g = 55.5
          , h = 19.5
          , i = 5.5
          , j = 15.5;
        b = Math.max(150 + g + h, b);
        var k = Math.max(30 + i + j, Math.floor((c - 60) / d.length));
        $(a).width(b),
        $(a).height(c),
        $(".plot-waveforms", a).height(c - 60),
        $.each(d, function(a, c) {
            c.canvas.width(b),
            c.canvas.height(k),
            c.canvas[0].width = b * c.pixelRatio,
            c.canvas[0].height = k * c.pixelRatio,
            c.canvas[0].getContext("2d").scale(c.pixelRatio, c.pixelRatio),
            c.bg_image[0].width = b * c.pixelRatio,
            c.bg_image[0].height = k * c.pixelRatio,
            c.bg_image[0].getContext("2d").scale(c.pixelRatio, c.pixelRatio),
            void 0 !== c.ylabel && (g = 70.5),
            void 0 !== c.xlabel && (j = 35.5)
        }
        ),
        $(a).find(".plot-scrollbar").css("margin-left", g).css("margin-right", h);
        var l = b - g - h
          , m = k - i - j
          , n = (d.xend - d.xstart) / l;
        $.each(d, function(a, b) {
            var c = (b.ymax - b.ymin) / m;
            b.plotx = function(a) {
                return (a - d.xstart) / n + g
            }
            ,
            b.ploty = function(a) {
                return i + (m - (a - b.ymin) / c)
            }
            ,
            b.datax = function(a) {
                return (a - g) * n + d.xstart
            }
            ,
            b.left = g,
            b.top = i,
            b.wplot = l,
            b.hplot = m,
            e(b)
        }
        ),
        f(d);
        var o = d.xstart == d.xmin && d.xend == d.xmax;
        if ($(a).find("#zoom").toggleClass("plot-tool-enabled", !o),
        $(a).find("#zoomout").toggleClass("plot-tool-enabled", !o),
        $(a).find(".plot-scrollbar-thumb").toggle(!o),
        !o) {
            var p = $(a).find(".plot-scrollbar-thumb")
              , q = (d.xmax - d.xmin) / l
              , r = (d.xend - d.xstart) / q
              , s = (d.xstart - d.xmin) / q;
            p.css("width", r),
            p.css("margin-left", s)
        }
    }
    function e(c) {
        var d = c.dataseries.xstart
          , e = c.dataseries.xend
          , f = b(d, e, c.wplot / 100);
        f.push(e);
        var i = c.bg_image[0].getContext("2d");
        i.clearRect(0, 0, c.bg_image[0].width, c.bg_image[0].height),
        i.fillStyle = j,
        i.fillRect(c.left, c.top, c.wplot, c.hplot),
        i.strokeStyle = k,
        i.fillStyle = h,
        i.font = l,
        i.textAlign = "center",
        i.textBaseline = "top";
        var o, p, q = c.xunits || "";
        for (o = f[0]; o < f[2]; o += f[1])
            p = Math.floor(c.plotx(o)) + .5,
            i.beginPath(),
            i.moveTo(p, c.top),
            i.lineTo(p, c.top + c.hplot),
            i.stroke(),
            i.fillText(a.utils.engineering_notation(o, 2) + q, p, c.top + c.hplot);
        var r = b(c.ymin, c.ymax, c.hplot / 100);
        for (i.textAlign = "right",
        i.textBaseline = "middle",
        o = r[0]; o < c.ymax; o += r[1])
            p = Math.floor(c.ploty(o)) + .5,
            i.beginPath(),
            i.moveTo(c.left, p),
            i.lineTo(c.left + c.wplot, p),
            i.stroke(),
            i.fillText(a.utils.engineering_notation(o, 2) + c.yunits, c.left - 2, p);
        i.font = m,
        c.xlabel && (i.textAlign = "center",
        i.textBaseline = "bottom",
        i.fillText(c.xlabel, c.left + c.wplot / 2, c.bg_image[0].height - 5)),
        c.ylabel && (i.save(),
        i.textAlign = "center",
        i.textBaseline = "top",
        i.translate(10, c.top + c.hplot / 2),
        i.rotate(-Math.PI / 2),
        i.fillText(c.ylabel, 0, 0),
        i.restore()),
        i.save(),
        i.beginPath(),
        i.rect(c.left, c.top, c.wplot, c.hplot),
        i.clip();
        for (var s = 0; s < c.xvalues.length; s += 1) {
            var t, u, v, w, x = c.xvalues[s], y = c.yvalues[s], z = g(x, d), A = x[z];
            if (i.strokeStyle = c.color[s] || "#268bd2",
            i.fillStyle = i.strokeStyle,
            i.lineWidth = 2,
            "analog" == c.type[s]) {
                for (t = c.plotx(A),
                u = c.ploty(y[z]),
                i.beginPath(),
                i.moveTo(t, u); e >= A && (z += 1,
                !(z > x.length)) && (A = x[z],
                void 0 !== A); ) {
                    var B = c.plotx(A)
                      , C = c.ploty(y[z]);
                    i.lineTo(B, C),
                    t = B,
                    u = C,
                    z % 100 == 99 && (i.stroke(),
                    i.beginPath(),
                    i.moveTo(t, u))
                }
                i.stroke()
            } else if ("digital" == c.type[s]) {
                v = c.ploty(0),
                w = c.ploty(1);
                var D = (v + w) / 2;
                for (t = c.plotx(A),
                u = y[z],
                i.beginPath(); e >= A && (z += 1,
                !(z > x.length)) && (A = x[z],
                void 0 !== A); ) {
                    var B = c.plotx(A);
                    2 != u ? (u = 0 == u ? v : 1 == u ? w : D,
                    i.moveTo(t, u),
                    i.lineTo(B, u)) : i.rect(t, v, B - t, w - v),
                    t = B,
                    u = y[z],
                    z % 100 == 99 && (i.stroke(),
                    i.fill(),
                    i.beginPath())
                }
                i.stroke(),
                i.fill()
            } else if ("string" == c.type[s]) {
                v = c.ploty(0),
                w = c.ploty(1);
                var E, F = (v + w) / 2;
                for (i.font = n,
                i.lineWidth = 1,
                i.textAlign = "center",
                i.textBaseline = "middle",
                t = c.plotx(A),
                u = y[z]; e >= A && (z += 1,
                !(z > x.length)) && (A = x[z],
                void 0 !== A); ) {
                    var B = c.plotx(A);
                    if ("number" == typeof u)
                        i.beginPath(),
                        i.moveTo(t, F),
                        i.lineTo(B, F),
                        i.stroke();
                    else if (i.strokeRect(t, v, B - t, w - v),
                    void 0 === u)
                        i.fillRect(t, v, B - t, w - v);
                    else {
                        E = i.measureText(u).width;
                        var G = Math.max(c.left, t)
                          , H = Math.min(c.left + c.wplot, B);
                        H - G > E && i.fillText(u, (G + H) / 2, F)
                    }
                    t = B,
                    u = y[z]
                }
            }
        }
        i.restore(),
        i.lineWidth = 1,
        i.strokeStyle = h,
        i.strokeRect(c.left, c.top, c.wplot, c.hplot),
        i.strokeRect(5.5, 5.5, 10, 10),
        i.beginPath(),
        i.moveTo(7.5, 7.5),
        i.lineTo(13.5, 13.5),
        i.moveTo(13.5, 7.5),
        i.lineTo(7.5, 13.5),
        i.stroke();
        var I = c.left
          , J = c.top;
        c.legend_right = [],
        c.legend_top = [];
        for (var s = 0; s < c.xvalues.length; s += 1) {
            var E = i.measureText(c.name[s]).width;
            i.globalAlpha = .7,
            i.fillStyle = j,
            i.fillRect(I, J, E + 30, 20),
            i.globalAlpha = 1,
            i.fillStyle = c.color[s],
            i.fillRect(I + 5, J + 5, 10, 10),
            i.strokeRect(I + 5, J + 5, 10, 10),
            i.fillStyle = h,
            i.textAlign = "left",
            i.textBaseline = "bottom",
            i.fillText(c.name[s], I + 20, J + 18),
            c.legend_right.push(I + 20 + E),
            c.legend_top.push(J),
            J += 15
        }
    }
    function f(b) {
        $(b.container).find("#zoomsel").toggleClass("plot-tool-enabled", void 0 !== b.sel0 && void 0 !== b.sel1),
        $.each(b, function(c, d) {
            var e = d.canvas[0].getContext("2d");
            if (e.clearRect(0, 0, d.canvas.width(), d.canvas.height()),
            e.drawImage(d.bg_image[0], 0, 0, d.canvas.width(), d.canvas.height()),
            b.sel0 && b.sel1) {
                e.fillStyle = "rgba(207,191,194,0.4)";
                var f = Math.min(b.sel0, b.sel1)
                  , k = Math.abs(b.sel0 - b.sel1);
                if (e.fillRect(f, d.top, k, d.hplot),
                e.strokeStyle = "rgba(207,191,194,0.8)",
                e.lineWidth = 1,
                e.beginPath(),
                e.moveTo(f, d.top),
                e.lineTo(f, d.top + d.hplot),
                e.moveTo(f + k, d.top),
                e.lineTo(f + k, d.top + d.hplot),
                e.stroke(),
                b.sel0 !== b.sel1) {
                    var o = Math.abs(d.datax(b.sel0) - d.datax(b.sel1))
                      , p = a.utils.engineering_notation(o, 3);
                    e.font = n,
                    e.textAlign = "right",
                    e.textBaseline = "top",
                    e.fillStyle = "rgb(0,0,0)";
                    for (var q = "", r = 0; r < p.length + 5; r += 1)
                        q += "\u2588";
                    e.fillText(q, f + k, d.top),
                    e.fillStyle = "rgb(255,255,255)",
                    e.fillText("dx=" + p + " ", f + k, d.top)
                }
            }
            if (void 0 !== b.cursor) {
                e.lineWidth = 1,
                e.strokeStyle = h,
                e.beginPath(),
                e.moveTo(b.cursor, d.top),
                e.lineTo(b.cursor, d.top + d.hplot),
                e.stroke();
                var s = d.datax(b.cursor)
                  , t = a.utils.engineering_notation(s, 4);
                if (d.xunits && (t += d.xunits),
                e.font = l,
                e.textAlign = "center",
                e.textBaseline = "top",
                e.fillStyle = i,
                e.fillText("\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588", b.cursor, d.top + d.hplot),
                e.fillStyle = h,
                e.fillText(t, b.cursor, d.top + d.hplot),
                "analog" == d.type[0])
                    for (var u = 0; u < d.xvalues.length; u += 1) {
                        var v = d.xvalues[u]
                          , w = d.yvalues[u]
                          , r = g(v, s)
                          , x = v[r]
                          , y = w[r]
                          , z = v[r + 1] || x
                          , A = w[r + 1] || y
                          , B = y;
                        x != z && (B = y + (s - x) / (z - x) * (A - y));
                        var C = d.plotx(s)
                          , D = d.ploty(B);
                        e.strokeStyle = d.color[u] || "#268bd2",
                        e.beginPath(),
                        e.arc(C, D, 5, 0, 2 * Math.PI),
                        e.stroke();
                        var E = d.legend_right[u]
                          , F = d.legend_top[u];
                        t = "=" + a.utils.engineering_notation(B, 2) + d.yunits,
                        e.font = m;
                        var G = e.measureText(t).width;
                        e.fillStyle = j,
                        e.globalAlpha = .7,
                        e.fillRect(E, F, G + 5, 20),
                        e.textAlign = "left",
                        e.textBaseline = "bottom",
                        e.fillStyle = h,
                        e.globalAlpha = 1,
                        e.fillText(t, E, F + 18)
                    }
            }
        }
        )
    }
    function g(a, b) {
        for (var c, d = 0, e = a.length - 1; e > d; )
            c = d + e >> 1,
            c == d && (c = e),
            a[c] <= b ? d = c : e = c - 1;
        return d
    }
    var h = "rgb(0,0,0)"
      , i = "rgb(238,238,238)"
      , j = "rgb(255,255,255)"
      , k = "rgb(220,220,220)"
      , l = "8pt sans-serif"
      , m = "10pt sans-serif"
      , n = '8pt Consolas,"Courier New",monospace'
      , o = "data:image/gif;base64,R0lGODlhEAAQAMT/AAAAAP///zAwYT09bpGRqZ6et5iYsKWlvbi40MzM5cXF3czM5OHh5tTU2fDw84uMom49DbWKcfLy8g0NDcDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAQABAAAAVZICWOZFlOwCQF5pg2TDMJbDs1DqI8g2TjOsSC0DMBGEGF4UAz3RQ6wiFRLEkmj8WyUC0FBAMpNdWiBCQD8DWCKq98lEkEAiiTAJB53S7Cz/kuECuAIzWEJCEAIf5PQ29weXJpZ2h0IDIwMDAgYnkgU3VuIE1pY3Jvc3lzdGVtcywgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLg0KSkxGIEdSIFZlciAxLjANCgA7"
      , p = "data:image/gif;base64,R0lGODlhEAAQAMT/AAAAAP///zAwYT09boSEnIqKopiYsJ6etqurxL+/18XF3dnZ8sXF0OHh5tTU2ePj5piZr2EwAMKXfg0NDcDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABQALAAAAAAQABAAAAVXICWOZFkCE2CWaeMwwLCKQPNMBCQEa/0UAEXiIFhNHKmkYcA7MQgKwMGw2PUgiYkBsWuWBoJpNTWjBATgAECCKgfelHVkUh5NIpJ5XXTP7/kRcH9mgyUhADshACH+T0NvcHlyaWdodCAyMDAwIGJ5IFN1biBNaWNyb3N5c3RlbXMsIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4NCkpMRiBHUiBWZXIgMS4wDQoAOw=="
      , q = "data:image/gif;base64,R0lGODlhEAAQAMT/AAAAAP///zAwYT09bn19lYSEnJGRqZ6et5iYsJ6etqWlvbi40MzM5cXF3czM5Li4w+Hh5tTU2fDw84uMom49DbWKcQ0NDcDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAABcALAAAAAAQABAAAAVX4CWOZFlagGWWaQQ9lrCKViQVxjQEay0RjYXDMFgBIKmkQsA7PQyLhEHB2PUmDoTisGuWBINpNTW7BAbggKWCKgfelzUFUB4BKJV5XXTP7/kUcH9mgyUhADshACH+T0NvcHlyaWdodCAyMDAwIGJ5IFN1biBNaWNyb3N5c3RlbXMsIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC4NCkpMRiBHUiBWZXIgMS4wDQoAOw=="
      , r = "data:image/gif;base64,R0lGODlhEAAQAIQBAAAAAP///zAwYT09bpGRqZ6et5iYsKWlvbi40MzM5cXF3czM5OHh5tTU2fDw84uMom49DbWKcfLy8g0NDf///////////////////////////////////////////////yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEAAB8ALAAAAAAQABAAAAVY4CeOZFlOwCQF5pg2TDMJbIsCODBIdgMgCgSAsDMBGICgAnCgmSY+IAGQKJYkt5y1FBAMCIdqqvUJSAZebARFXvE+kwgEQCYBIHJ6XXSX710QK38jNYMkIQA7";
    return {
        graph: c,
        tick_interval: b
    }
}
,
jade_defs.device_level = function(a) {
    function b(b) {
        var c = b.match(/(\w+)\s*\((.*?)\)\s*/)
          , d = $.map(c[2].split(","), a.utils.parse_number);
        return {
            type: c[1],
            args: d
        }
    }
    function c(a, b) {
        var c;
        try {
            c = d(a.aspect, b)
        } catch (e) {
            throw a.redraw_background(),
            e
        }
        return c
    }
    function d(c, d) {
        var e = ["ground", "jumper"];
        a.model.map_modules(/^\/analog\/.*/, function(a) {
            e.push(a.get_name())
        }
        );
        var f = c.netlist(e, d, "", {}, [])
          , g = [];
        return $.each(f, function(c, d) {
            var e = d[0]
              , f = d[1]
              , h = d[2];
            if ("/analog/nfet" == e ? g.push({
                type: "nfet",
                connections: f,
                properties: {
                    name: h.name,
                    W: a.utils.parse_number(h.W),
                    L: a.utils.parse_number(h.L)
                }
            }) : "/analog/pfet" == e ? g.push({
                type: "pfet",
                connections: f,
                properties: {
                    name: h.name,
                    W: a.utils.parse_number(h.W),
                    L: a.utils.parse_number(h.L)
                }
            }) : "/analog/resistor" == e ? g.push({
                type: "resistor",
                connections: f,
                properties: {
                    name: h.name,
                    value: a.utils.parse_number(h.r)
                }
            }) : "/analog/inductor" == e && g.push({
                type: "inductor",
                connections: f,
                properties: {
                    name: h.name,
                    value: a.utils.parse_number(h.l)
                }
            }),
            "/analog/capacitor" == e)
                g.push({
                    type: "capacitor",
                    connections: f,
                    properties: {
                        name: h.name,
                        value: a.utils.parse_number(h.c)
                    }
                });
            else if ("/analog/v_source" == e)
                g.push({
                    type: "voltage source",
                    connections: f,
                    properties: {
                        name: h.name,
                        value: b(h.value)
                    }
                });
            else if ("/analog/i_source" == e)
                g.push({
                    type: "current source",
                    connections: f,
                    properties: {
                        name: h.name,
                        value: b(h.value)
                    }
                });
            else if ("/analog/opamp" == e)
                g.push({
                    type: "opamp",
                    connections: f,
                    properties: {
                        name: h.name,
                        A: a.utils.parse_number(h.A)
                    }
                });
            else if ("/analog/diode" == e)
                g.push({
                    type: "diode",
                    connections: f,
                    properties: {
                        name: h.name,
                        area: a.utils.parse_number(h.area)
                    }
                });
            else if ("ground" == e)
                g.push({
                    type: "ground",
                    connections: [f.gnd],
                    properties: {}
                });
            else if ("jumper" == e) {
                var i = [];
                $.each(f, function(a, b) {
                    i.push(b)
                }
                ),
                g.push({
                    type: "connect",
                    connections: i,
                    properties: {}
                })
            } else
                "/analog/v_probe" == e ? g.push({
                    type: "voltage probe",
                    connections: f,
                    properties: {
                        name: h.name,
                        color: h.color,
                        offset: a.utils.parse_number(h.offset)
                    }
                }) : "/analog/i_probe" == e ? g.push({
                    type: "voltage source",
                    connections: f,
                    properties: {
                        name: h.name,
                        value: {
                            type: "dc",
                            args: [0]
                        }
                    }
                }) : "/analog/initial_voltage" == e && g.push({
                    type: "initial voltage",
                    connections: f,
                    properties: {
                        name: h.name,
                        IV: a.utils.parse_number(h.IV)
                    }
                })
        }
        ),
        g
    }
    function e(a, b) {
        var c = {};
        for (var d in b)
            c[d] = b[d];
        var e = a.aspect.connection_points;
        for (var f in e)
            e[f][0].display_voltage(a, c);
        a.aspect.map_over_components(function(b) {
            return b.display_current(a, c),
            !1
        }
        )
    }
    function f(b) {
        b.remove_annotations();
        var d, f;
        try {
            if (f = c(b, []),
            0 == f.length)
                return;
            d = new a.cktsim.Circuit(f,b.editor.options)
        } catch (g) {
            return g instanceof Error && (g = g.stack.split("\n").join("<br>")),
            void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(g), $(b.canvas).offset())
        }
        var h;
        try {
            if (h = d.dc(!0),
            "string" == typeof h)
                throw results;
            if (h instanceof Error)
                throw results.stack.split("\n").join("<br>")
        } catch (g) {
            return void a.window("Errors during DC analysis", $('<div class="jade-alert"></div>').html(g), $(b.canvas).offset())
        }
        void 0 !== h && b.add_annotation(function(a) {
            e(a, h)
        }
        )
    }
    function g(b) {
        b.remove_annotations();
        var d, e = "Starting value", f = "End value", g = "Step size", j = "Name of V or I source for sweep";
        try {
            if (d = c(b, []),
            0 === i(d).length)
                throw "There are no probes in the diagram!"
        } catch (k) {
            return void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(k), $(b.canvas).offset())
        }
        var l = b.aspect.module
          , m = {};
        $.each(["Sweep 1", "Sweep 2"], function(b, c) {
            m["(" + c + ") " + e] = a.build_input("text", 10, l.property_value(c + "_vstart")),
            m["(" + c + ") " + f] = a.build_input("text", 10, l.property_value(c + "_vstop")),
            m["(" + c + ") " + g] = a.build_input("text", 10, l.property_value(c + "_vstep")),
            m["(" + c + ") " + j] = a.build_input("text", 10, l.property_value(c + "_source")),
            "Sweep 1" == c && (m["<i>Optional second sweep</i>"] = "")
        }
        );
        var n = a.build_table(m);
        b.dialog("DC Sweep", n, function() {
            var c = [];
            $.each(["Sweep 1", "Sweep 2"], function(b, d) {
                var h = m["(" + d + ") " + e].value;
                h && (h = a.utils.parse_number_alert(h)),
                c.push(h),
                l.set_property_attribute(d + "_vstart", "value", h),
                h = m["(" + d + ") " + f].value,
                h && (h = a.utils.parse_number_alert(h)),
                c.push(h),
                l.set_property_attribute(d + "_vstop", "value", h),
                h = m["(" + d + ") " + g].value,
                h && (h = a.utils.parse_number_alert(h)),
                c.push(h),
                l.set_property_attribute(d + "_vstep", "value", h),
                h = m["(" + d + ") " + j].value,
                c.push(h),
                l.set_property_attribute(d + "_source", "value", h)
            }
            ),
            h(d, b, {
                start: c[0],
                stop: c[1],
                step: c[2],
                source: c[3]
            }, {
                start: c[4],
                stop: c[5],
                step: c[6],
                source: c[7]
            })
        }
        )
    }
    function h(b, c, d, e) {
        if (b.length > 0) {
            var f;
            try {
                if (f = a.cktsim.dc_analysis(b, d, e, c.editor.options),
                "string" == typeof f)
                    throw f;
                var g = [];
                $.each(i(b), function(b, c) {
                    var h = {
                        xvalues: [],
                        yvalues: [],
                        name: [],
                        color: [],
                        xunits: "V",
                        yunits: "",
                        type: []
                    };
                    g.push(h);
                    for (var i, j, k, l, m, n = 0; ; ) {
                        if (e.source ? (i = f[n][c.label],
                        j = f[n]._sweep1_,
                        k = f[n]._sweep2_,
                        n += 1) : (i = f[c.label],
                        j = f._sweep1_),
                        void 0 === i)
                            throw "No values to plot for node " + c.label;
                        if (l = "current" == c.type ? c.label : "Node " + c.label,
                        m = c.color,
                        e.source && (l += " [with " + e.source + "=" + a.utils.engineering_notation(k, 2) + (e.units || "") + "]",
                        m = p[n % p.length]),
                        h.xvalues.push(j),
                        h.yvalues.push(i),
                        h.name.push(l),
                        h.color.push(m),
                        h.type.push("analog"),
                        h.xunits = d.units || "V",
                        h.yunits = "current" == c.type ? "A" : "V",
                        h.xlabel = d.source + " (" + d.units + ")",
                        h.ylabel = c.label + " (" + h.yunits + ")",
                        !e.source || n >= f.length)
                            break
                    }
                }
                );
                var h = a.plot.graph(g);
                c.window("Results of DC Sweep", h)
            } catch (j) {
                return j instanceof Error && (j = j.stack.split("\n").join("<br>")),
                void a.window("Errors during DC Sweep", $('<div class="jade-alert"></div>').html(j), $(c.canvas).offset())
            }
        }
    }
    function i(a) {
        for (var b = [], c = a.length - 1; c >= 0; c -= 1) {
            var d = a[c]
              , e = d.type
              , f = d.connections
              , g = d.properties
              , h = g.offset;
            (void 0 === h || "" === h) && (h = "0"),
            "voltage probe" == e ? b.push({
                color: g.color,
                label: f.probe,
                offset: h,
                type: "voltage"
            }) : "voltage source" == e && "dc" == g.value.type && 1 == g.value.args.length && 0 === g.value.args[0] && b.push({
                color: g.color,
                label: "I(" + g.name + ")",
                offset: h,
                type: "current"
            })
        }
        return b
    }
    function j(b) {
        b.remove_annotations();
        var d, e = "Starting frequency (Hz)", f = "Ending frequency (Hz)", g = "Name of V or I source for ac";
        try {
            if (d = c(b, []),
            0 === i(d).length)
                throw "There are no voltage probes in the diagram!"
        } catch (h) {
            return void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(h), $(b.canvas).offset())
        }
        var j = b.aspect.module
          , l = {};
        l[e] = a.build_input("text", 10, j.property_value("ac_fstart") || "10"),
        l[f] = a.build_input("text", 10, j.property_value("ac_fstop") || "1G"),
        l[g] = a.build_input("text", 10, j.property_value("ac_source"));
        var m = a.build_table(l);
        b.dialog("AC Analysis", m, function() {
            var c = l[e].value
              , h = l[f].value
              , i = l[g].value;
            j.set_property_attribute("ac_fstart", "value", c),
            j.set_property_attribute("ac_fstop", "value", h),
            j.set_property_attribute("ac_source", "value", i),
            c = a.utils.parse_number_alert(c),
            h = a.utils.parse_number_alert(h),
            void 0 !== c && void 0 !== h && k(d, b, c, h, i, b.editor.options)
        }
        )
    }
    function k(b, c, d, e, f) {
        var g = 50;
        if (b.length > 0) {
            var h, j;
            try {
                if (h = new a.cktsim.Circuit(b),
                j = h.ac(g, d, e, f),
                "string" == typeof j)
                    throw j
            } catch (k) {
                return k instanceof Error && (k = k.stack.split("\n").join("<br>")),
                void a.window("Errors during AC analysis", $('<div class="jade-alert"></div>').html(k), $(c.canvas).offset())
            }
            var l, n, o, p = j._frequencies_;
            for (l = p.length - 1; l >= 0; l -= 1)
                p[l] = Math.log(p[l]) / Math.LN10;
            var q, r, s, t = i(b), u = [], v = [];
            for (l = t.length - 1; l >= 0; l -= 1)
                "voltage" == t[l].type && (v[l] = t[l].color,
                q = t[l].label,
                o = j[q].magnitude,
                u[l] = m(o));
            var w = m(u);
            if (1e-16 > w)
                c.message("Zero ac response, -infinity on DB scale.");
            else
                for (l = t.length - 1; l >= 0; l -= 1)
                    if ("voltage" == t[l].type && u[l] / w < 1e-10)
                        return void c.message("Near zero ac response, remove " + v[l] + " probe");
            var x = [];
            for (l = t.length - 1; l >= 0; l -= 1)
                if ("voltage" == t[l][3]) {
                    r = t[l].color,
                    q = t[l].label,
                    s = t[l].offset,
                    o = j[q].magnitude;
                    var y = 1;
                    for (n = o.length - 1; n >= 0; n -= 1)
                        o[n] = 20 * Math.log(o[n] / y) / Math.LN10;
                    x.push({
                        xvalues: [p],
                        yvalues: [o],
                        name: [q],
                        color: [r],
                        ylabel: "Magnitude",
                        yunits: "dB",
                        type: ["analog"]
                    }),
                    x.push({
                        xvalues: [p],
                        yvalues: [j[q].phase],
                        name: [q],
                        color: [r],
                        xlabel: "log(Frequency in Hz)",
                        ylabel: "Phase",
                        yunits: "\xb0",
                        type: ["analog"]
                    })
                }
            var z = a.plot.graph(x);
            c.window("Results of AC Analysis", z)
        }
    }
    function l(a, b, c) {
        if (void 0 === c)
            return void 0;
        for (var d = 0; d < b.length; d += 1)
            if (a < b[d]) {
                var e = 0 === d ? b[0] : b[d - 1]
                  , f = b[d];
                if (void 0 === f)
                    return void 0;
                var g = 0 === d ? c[0] : c[d - 1]
                  , h = c[d]
                  , i = g;
                return a != e && (i += (a - e) * (h - g) / (f - e)),
                i
            }
        return void 0
    }
    function m(a) {
        for (var b = -1 / 0, c = a.length - 1; c >= 0; c -= 1)
            a[c] > b && (b = a[c]);
        return b
    }
    function n(b) {
        b.remove_annotations();
        var d, e = "Stop Time (seconds)";
        try {
            if (d = c(b, []),
            0 === i(d).length)
                throw "There are no probes in the diagram!"
        } catch (f) {
            return f instanceof Error && (f = f.stack.split("\n").join("<br>")),
            void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(f), $(b.canvas).offset())
        }
        var g = b.aspect.module
          , h = {};
        h[e] = a.build_input("text", 10, g.property_value("tran_tstop"));
        var j = a.build_table(h);
        b.dialog("Transient Analysis", j, function() {
            g.set_property_attribute("tran_tstop", "value", h[e].value);
            var c = a.utils.parse_number_alert(g.property_value("tran_tstop"));
            if (d.length > 0 && void 0 !== c) {
                for (var f = i(d), j = {}, k = f.length - 1; k >= 0; k -= 1)
                    j[k] = f[k].label;
                var l = a.progress_report();
                b.window("Progress", l),
                a.cktsim.transient_analysis(d, c, j, function(c, d) {
                    return void 0 === d ? (l[0].update_progress(c),
                    l[0].stop_requested) : (a.window_close(l.win),
                    void o(d, b, f))
                }
                , b.editor.options)
            }
        }
        )
    }
    function o(b, c, d) {
        var e;
        if ("string" == typeof b)
            a.window("Errors during Transient analysis", $('<div class="jade-alert"></div>').html(b), $(c.canvas).offset());
        else if (void 0 === b)
            c.message("Sorry, no results from transient analysis to plot!");
        else {
            for (var f, g, h = [], i = b._xvalues_, j = d.length - 1; j >= 0; j -= 1)
                f = d[j].color,
                g = d[j].label,
                "x-axis" == f && (i = b[g]);
            for (var j = d.length - 1; j >= 0; j -= 1)
                f = d[j].color,
                g = d[j].label,
                e = b[g],
                void 0 === e ? c.message("The " + f + ' probe is connected to node "' + g + '" which is not an actual circuit node') : "x-axis" != f && h.push({
                    xvalues: [i],
                    yvalues: [e],
                    name: [g],
                    color: [f],
                    xunits: "s",
                    yunits: "voltage" == d[j].type ? "V" : "A",
                    type: ["analog"]
                });
            var k = a.plot.graph(h);
            c.window("Results of Transient Analysis", k)
        }
    }
    a.model.ConnectionPoint.prototype.display_voltage = function(a, b) {
        var c = b[this.label];
        if (void 0 !== c) {
            var d = c.toFixed(2) + "V";
            a.c.globalAlpha = .85,
            this.parent.draw_text(a, "\u2588\u2588\u2588", this.offset_x, this.offset_y, 4, a.annotation_font, a.background_style),
            a.c.globalAlpha = 1,
            this.parent.draw_text(a, d, this.offset_x, this.offset_y, 4, a.annotation_font, a.annotation_style),
            delete b[this.label]
        }
    }
    ,
    a.model.Component.prototype.display_current = function(b, c) {
        if ("/analog/i_probe" == this.type()) {
            var d = "I(" + this.name + ")"
              , e = c[d];
            if (void 0 !== e) {
                var f = a.utils.engineering_notation(e, 2) + "A";
                this.draw_text(b, f, 8, 5, 1, b.annotation_font, b.annotation_style),
                delete c[d]
            }
        }
    }
    ,
    a.schematic_view.schematic_tools.push(["DC", a.icons.dc_icon, "DC Analysis", f]);
    var p = ["#268bd2", "#dc322f", "#859900", "#b58900", "#6c71c4", "#d33682", "#2aa198"];
    return a.schematic_view.schematic_tools.push(["sweep", a.icons.sweep_icon, "DC Sweep for 1 or 2 sources", g]),
    a.schematic_view.schematic_tools.push(["AC", a.icons.ac_icon, "AC Analysis", j]),
    a.schematic_view.schematic_tools.push(["tran", a.icons.tran_icon, "Device-level Simulation (transient analysis)", n]),
    {
        diagram_device_netlist: c,
        interpolate: l
    }
}
,
jade_defs.cktsim = function(a) {
    function b(a) {
        $.each(a, function(a, b) {
            var c = [];
            for (var d in b.connections)
                c.push(d + "=" + b.connections[d]);
            var e = [];
            for (var f in b.properties)
                e.push(f + "=" + JSON.stringify(b.properties[f]));
            console.log(b.type + " " + c.join(" ") + "; " + e.join(" "))
        }
        )
    }
    function c(b, c, d, e) {
        if (b.length > 0) {
            var g, h, i, j, k, l, m, n, q, r, s = new f(b,e || {});
            if (c.source) {
                if (g = s.device_map[c.source.toLowerCase()],
                g instanceof o)
                    c.units = "V";
                else {
                    if (!(g instanceof p))
                        throw "Device 1 not independent source in DC sweep: " + c.source;
                    c.units = "A"
                }
                h = c.start,
                i = c.stop,
                j = c.step,
                j = i >= h ? Math.abs(j) : -Math.abs(j),
                k = g.src
            }
            if (d.source) {
                if (l = s.device_map[d.source.toLowerCase()],
                l instanceof o)
                    d.units = "V";
                else {
                    if (!(l instanceof p))
                        throw "Device 2 not independent source in DC sweep: " + d.source;
                    d.units = "A"
                }
                m = d.start,
                n = d.stop,
                q = d.step,
                q = n >= m ? Math.abs(q) : -Math.abs(q),
                r = l.src
            }
            for (var t = h, u = m, v = {
                _sweep1_: [],
                _network_: s
            }, w = []; ; ) {
                g && (g.src = a.utils.parse_source({
                    type: "dc",
                    args: [t]
                })),
                l && (l.src = a.utils.parse_source({
                    type: "dc",
                    args: [u]
                }));
                var x = s.dc(!0);
                for (var y in x)
                    "_network_" != y && (void 0 === v[y] && (v[y] = []),
                    v[y].push(x[y]));
                if (v._sweep1_.push(t),
                v._sweep2_ = u,
                void 0 === t)
                    break;
                if (Math.abs(t - i) < Math.abs(.01 * j)) {
                    if (void 0 === u)
                        break;
                    if (w.push(v),
                    Math.abs(u - n) < Math.abs(.01 * q)) {
                        v = w;
                        break
                    }
                    v = {
                        _sweep1_: [],
                        _network_: s
                    },
                    t = h,
                    u += q,
                    (q > 0 && u > n || 0 > q && n > u) && (u = n)
                } else
                    t += j,
                    (j > 0 && t > i || 0 > j && i > t) && (t = i)
            }
            return void 0 !== k && (g.src = k),
            void 0 !== r && (l.src = r),
            v
        }
        return void 0
    }
    function d(a, b, c, d, e) {
        var g = 50;
        if (a.length > 0) {
            var h = new f(a,e || {});
            return h.ac(g, b, c, d)
        }
        return void 0
    }
    function e(a, b, c, d, e) {
        if (a.length > 0 && void 0 !== b) {
            try {
                var g = new f(a,e || {})
            } catch (h) {
                return h instanceof Error && (h = h.stack.split("\n").join("<br>")),
                void d(void 0, h.toString())
            }
            var i = {};
            return i.probe_names = c,
            i.update_interval = 250,
            i.finish = function(a) {
                d(void 0, a)
            }
            ,
            i.stop_requested = !1,
            i.update = function(a) {
                d(a, void 0) && (i.stop_requested = !0)
            }
            ,
            void setTimeout(function() {
                try {
                    g.tran_start(i, 100, 0, b)
                } catch (a) {
                    a instanceof Error && (a = a.stack.split("\n").join("<br>")),
                    i.finish(a)
                }
            }
            , 1)
        }
        return void 0
    }
    function f(a, b) {
        b && (b.v_abstol && (z = b.v_abstol),
        b.i_abstol && (A = b.ia_abstol,
        J = Math.sqrt(A)),
        b.reltol && (H = b.reltol,
        K = Math.sqrt(H))),
        this.node_map = {},
        this.ntypes = [],
        this.devices = [],
        this.device_map = {},
        this.voltage_sources = [],
        this.current_sources = [],
        this.initial_voltages = [],
        this.finalized = !1,
        this.diddc = !1,
        this.node_index = -1,
        this.periods = 1,
        void 0 !== a && this.load_netlist(a)
    }
    function g(a, b) {
        for (var c = new Array(a), d = a - 1; d >= 0; d -= 1) {
            c[d] = new Array(b);
            for (var e = b - 1; e >= 0; e -= 1)
                c[d][e] = 0
        }
        return c
    }
    function h(a, b, c, d) {
        var e = a.length
          , f = a[0].length;
        if (e != c.length || f != b.length)
            throw "Rows of M mismatched to b or cols mismatch to x.";
        for (var g = 0; e > g; g += 1) {
            for (var h = 0, i = 0; f > i; i += 1)
                h += a[g][i] * b[i];
            c[g] = d * h
        }
    }
    function i(a, b, c, d, e) {
        var f, g, h = a.length, i = a[0].length;
        if (h > b.length || i > b[0].length)
            throw "Row or columns of A to large for B";
        if (h > e.length || i > e[0].length)
            throw "Row or columns of A to large for C";
        if ("number" == typeof c && "number" == typeof d)
            for (f = 0; h > f; f += 1)
                for (g = 0; i > g; g += 1)
                    e[f][g] = c * a[f][g] + d * b[f][g];
        else if ("number" == typeof d && c instanceof Array)
            for (f = 0; h > f; f += 1)
                for (g = 0; i > g; g += 1)
                    e[f][g] = c[f] * a[f][g] + d * b[f][g];
        else {
            if (!(typeof d instanceof Array && c instanceof Array))
                throw "scalea and scaleb must be scalars or Arrays";
            for (f = 0; h > f; f += 1)
                for (g = 0; i > g; g += 1)
                    e[f][g] = c[f] * a[f][g] + d[f] * b[f][g]
        }
    }
    function j(a, b) {
        var c = a.length
          , d = a[0].length;
        if (c > b.length || d > b[0].length)
            throw "Rows or cols > rows or cols of dest";
        for (var e = 0; c > e; e += 1)
            for (var f = 0; d > f; f += 1)
                b[e][f] = a[e][f]
    }
    function k(a) {
        var b, c, d, e, f, h = a.length, i = a[0].length, k = g(h, i);
        j(a, k);
        var l = 0;
        for (e = h - 1; e >= 0; e -= 1)
            for (f = h - 1; f >= 0; f -= 1)
                Math.abs(k[e][f]) > l && (l = Math.abs(k[e][f]));
        var m = 0
          , n = 0;
        for (e = 0; h > e; e += 1)
            for (f = n; i > f; f += 1) {
                var o = Math.abs(k[e][f])
                  , p = e;
                for (c = e + 1; h > c; c += 1)
                    b = Math.abs(k[c][f]),
                    b > o && (o = b,
                    p = c);
                if (Math.abs(o) > B * l) {
                    for (n = f + 1,
                    m += 1,
                    b = k[e],
                    k[e] = k[p],
                    k[p] = b,
                    c = e + 1; h > c; c += 1)
                        if (b = k[c][f] / k[e][f],
                        0 !== b)
                            for (d = f; i > d; d += 1)
                                k[c][d] -= k[e][d] * b;
                    break
                }
            }
        return m
    }
    function l(a, b) {
        var c, d, e, f, g = a.length, h = a[0].length;
        if (null  !== b)
            for (c = g - 1; c >= 0; c -= 1)
                a[c][h - 1] = b[c];
        var i = 0
          , j = g - 1;
        for (c = 0; g > c; c += 1) {
            var k = c
              , l = 0;
            for (d = c; g > d; d += 1) {
                f = a[d];
                var m = 0;
                for (e = h - 2; e >= 0; e -= 1)
                    m += f[e] * f[e];
                (c == d || m > l) && (k = d,
                l = m)
            }
            if (k > c) {
                var n = a[c];
                a[c] = a[k],
                a[k] = n
            }
            var o = Math.sqrt(l);
            0 === c && (i = o);
            var p;
            if (!(o > i * B)) {
                j = c - 1;
                break
            }
            for (p = 1 / o,
            f = a[c],
            e = h - 1; e >= 0; e -= 1)
                f[e] *= p;
            for (d = c + 1; g > d; d += 1) {
                var q = a[d]
                  , r = 0;
                for (e = h - 2; e >= 0; e -= 1)
                    r += f[e] * q[e];
                for (e = h - 1; e >= 0; e -= 1)
                    q[e] -= r * f[e]
            }
        }
        var s = new Array(h - 1);
        for (e = h - 2; e >= 0; e -= 1)
            s[e] = 0;
        for (c = j; c >= 0; c -= 1)
            for (f = a[c],
            e = h - 2; e >= 0; e -= 1)
                s[e] += f[e] * f[h - 1];
        return s
    }
    function m(a, b) {
        var c, d, e, f = a.length;
        if (null  !== b)
            for (var g = 0; f > g; g += 1)
                a[g][f] = b[g];
        for (var h = 0; f > h; h += 1) {
            var i = Math.abs(a[h][h])
              , j = h;
            for (d = h + 1; f > d; d += 1)
                c = Math.abs(a[d][h]),
                c > i && (i = c,
                j = d);
            for (0 === i ? a[h][h] = B : (c = a[h],
            a[h] = a[j],
            a[j] = c),
            d = h + 1; f > d; d += 1)
                if (c = a[d][h] / a[h][h],
                0 !== c)
                    for (e = h; f >= e; e += 1)
                        a[d][e] -= a[h][e] * c
        }
        var k = new Array(f);
        for (d = f - 1; d >= 0; d -= 1) {
            for (c = a[d][f],
            e = f - 1; e > d; e -= 1)
                c -= a[d][e] * k[e];
            k[d] = c / a[d][d]
        }
        return k
    }
    function n() {}
    function o(b, c, d, e) {
        n.call(this),
        this.src = a.utils.parse_source(e),
        this.npos = b,
        this.nneg = c,
        this.branch = d
    }
    function p(b, c, d) {
        n.call(this),
        this.src = a.utils.parse_source(d),
        this.npos = b,
        this.nneg = c
    }
    function q(a, b, c) {
        n.call(this),
        this.n1 = a,
        this.n2 = b,
        this.g = 1 / c
    }
    function r(a, b, c, d) {
        n.call(this),
        this.anode = a,
        this.cathode = b,
        this.area = c,
        this.type = d,
        this.is = 1e-14,
        this.ais = this.area * this.is,
        this.vt = "normal" == d ? .0258 : 1e-4,
        this.exp_arg_max = 50,
        this.exp_max = Math.exp(this.exp_arg_max)
    }
    function s(a, b, c) {
        n.call(this),
        this.n1 = a,
        this.n2 = b,
        this.value = c
    }
    function t(a, b, c, d) {
        n.call(this),
        this.n1 = a,
        this.n2 = b,
        this.branch = c,
        this.value = d
    }
    function u(a, b, c, d, e, f, g) {
        n.call(this),
        this.np = a,
        this.nn = b,
        this.no = c,
        this.ng = d,
        this.branch = e,
        this.gain = f,
        this.name = g
    }
    function v(a, b, c, d, e, f, g) {
        if ("n" != g && "p" != g)
            throw f + " fet type is not n or p";
        n.call(this),
        this.d = a,
        this.g = b,
        this.s = c,
        this.name = f,
        this.W = d,
        this.L = e,
        this.ratio = d / e,
        this.type_sign = "n" == g ? 1 : -1,
        this.vt = .5,
        this.kp = "n" == g ? 12e-5 : 25e-6,
        this.beta = this.kp * this.ratio,
        this.lambda = .05,
        this.g_leak = 1e-8 * this.beta
    }
    var w = 0
      , x = 1
      , y = .3
      , z = 1e-6
      , A = 1e-12
      , B = 1e-12
      , C = 1e3
      , D = 20
      , E = 2
      , F = 8
      , G = 4
      , H = 1e-4
      , I = 10
      , J = Math.sqrt(A)
      , K = Math.sqrt(H);
    f.prototype.history = function(a) {
        if (void 0 === this.result || void 0 === this.result[a])
            return void 0;
        var b = this.result[a];
        if ("number" == typeof b) {
            var c = b;
            b = this.result._xvalues_.slice();
            for (var d = 0; d < b.length; d += 1)
                b[d] = c;
            this.result[a] = b
        }
        return {
            xvalues: this.result._xvalues_,
            yvalues: b
        }
    }
    ,
    f.prototype.result_type = function() {
        return "analog"
    }
    ,
    f.prototype.node_list = function() {
        var a = [];
        for (var b in this.results)
            a.push(b);
        return a
    }
    ,
    f.prototype.gnd_node = function() {
        return -1
    }
    ,
    f.prototype.node = function(a, b) {
        return this.node_index += 1,
        a && (this.node_map[a] = this.node_index),
        this.ntypes.push(b),
        this.node_index
    }
    ,
    f.prototype.finalize = function() {
        if (!this.finalized) {
            this.finalized = !0,
            this.N = this.node_index + 1;
            for (var a = this.devices.length - 1; a >= 0; a -= 1)
                this.devices[a].finalize(this);
            for (this.matrix = g(this.N, this.N + 1),
            this.Gl = g(this.N, this.N),
            this.G = g(this.N, this.N),
            this.C = g(this.N, this.N),
            this.soln_max = new Array(this.N),
            this.abstol = new Array(this.N),
            this.solution = new Array(this.N),
            this.rhs = new Array(this.N),
            a = this.N - 1; a >= 0; a -= 1)
                this.soln_max[a] = 0,
                this.abstol[a] = this.ntypes[a] == w ? z : A,
                this.solution[a] = 0,
                this.rhs[a] = 0;
            for (a = 0; a < this.initial_voltages.length; a += 1) {
                var b = this.initial_voltages[a].node
                  , c = this.initial_voltages[a].v;
                this.solution[b] = c,
                this.soln_max[b] = c
            }
            for (a = this.devices.length - 1; a >= 0; a -= 1)
                this.devices[a].load_linear(this);
            var d = this.voltage_sources.length;
            if (d > 0) {
                var e = g(d, this.N);
                for (a = d - 1; a >= 0; a -= 1)
                    for (var f = this.voltage_sources[a].branch, h = this.N - 1; h >= 0; h -= 1)
                        e[a][h] = this.Gl[f][h];
                var i = k(e);
                if (d > i)
                    throw "Warning!!! Circuit has a voltage source loop or a source or current probe shorted by a wire, please remove the source or the wire causing the short."
            }
        }
        return !0
    }
    ,
    f.prototype.load_netlist = function(a) {
        var b, c, d, e, f, g;
        for (b = a.length - 1; b >= 0; b -= 1)
            if ("ground" == a[b].type)
                for (f = a[b].connections,
                c = 0; c < f.length; c += 1)
                    d = f[c],
                    this.node_map[d] = this.gnd_node();
        var h = {};
        for (b = a.length - 1; b >= 0; b -= 1)
            if ("connect" == a[b].type) {
                if (f = a[b].connections,
                f.length <= 1)
                    continue;var i = f[0];
                for (c = 1; c < f.length; c += 1)
                    if (d = f[c],
                    void 0 !== this.node_map[d]) {
                        i = d;
                        break
                    }
                for (; void 0 !== h[i]; )
                    i = h[i];
                for (c = 1; c < f.length; c += 1) {
                    for (d = f[c]; void 0 !== h[d]; )
                        d = h[d];
                    i != d && (h[d] = i)
                }
            }
        var j = !1;
        for (this.counts = {},
        b = a.length - 1; b >= 0; b -= 1) {
            e = a[b];
            var k = e.type
              , l = e.properties;
            this.counts[k] = (this.counts[k] || 0) + 1;
            var f = {};
            for (d in e.connections) {
                for (g = e.connections[d]; void 0 !== h[g]; )
                    g = h[g];
                var m = this.node_map[g];
                void 0 === m ? m = this.node(g, w) : m == this.gnd_node() && (j = !0),
                f[d] = m
            }
            var n = l.name;
            switch (k) {
            case "resistor":
                this.r(f.n1, f.n2, l.value, n);
                break;
            case "diode":
                this.d(f.anode, f.cathode, l.area, l.type, n);
                break;
            case "capacitor":
                this.c(f.n1, f.n2, l.value, n);
                break;
            case "inductor":
                break;
            case "voltage source":
                this.v(f.nplus, f.nminus, l.value, n);
                break;
            case "current source":
                this.i(f.nplus, f.nminus, l.value, n);
                break;
            case "opamp":
                this.opamp(f.nplus, f.nminus, f.output, f.gnd, l.A, n);
                break;
            case "nfet":
                this.n(f.d, f.g, f.s, l.W, l.L, n);
                break;
            case "pfet":
                this.p(f.d, f.g, f.s, l.W, l.L, n);
                break;
            case "voltage probe":
                break;
            case "ground":
                break;
            case "connect":
                break;
            case "initial voltage":
                this.initial_voltages.push({
                    node: f.node,
                    v: l.IV
                });
                break;
            default:
                throw "Unrecognized device type " + k
            }
        }
        if (!j)
            throw "Please make at least one connection to ground (node gnd)";
        for (g in h) {
            for (d = g; void 0 !== h[d]; )
                d = h[d];
            b = this.node_map[d],
            void 0 !== b && (this.node_map[g] = b)
        }
        this.find_cmos_gates();
        var o = (this.node_index + 1).toString() + " nodes";
        this.size = 0;
        for (var p in this.counts)
            o += ", " + this.counts[p].toString() + " " + p,
            this.size += this.counts[p];
        console.log(o)
    }
    ,
    f.prototype.find_cmos_gates = function() {
        var a = {};
        $.each(this.devices, function(b, c) {
            c instanceof v && (void 0 === a[c.d] && (a[c.d] = []),
            a[c.d].push(c),
            void 0 === a[c.s] && (a[c.s] = []),
            a[c.s].push(c))
        }
        );
        var b = [];
        $.each(a, function(a, c) {
            var d = !1
              , e = !1;
            $.each(c, function(a, b) {
                1 == b.type_sign ? d = !0 : e = !0
            }
            ),
            d && e && b.push(a)
        }
        ),
        this.counts.cmos_gates = b.length
    }
    ,
    f.prototype.find_solution = function(a, b) {
        for (var c, d, e, f = this.solution, g = this.rhs, h = [], i = 0, j = !1, k = 0, m = 0; b > m; m += 1) {
            var n;
            for (a.call(this, f, g),
            e = 0,
            n = this.N - 1; n >= 0; n -= 1)
                this.ntypes[n] == w && (e += Math.abs(g[n]));
            if (m > 0 && j === !1 && e > i) {
                for (n = this.N - 1; n >= 0; n -= 1)
                    f[n] -= h[n];
                m -= 1,
                j = !0
            } else
                h = l(this.matrix, g),
                i > e ? k += 1 : k = 0,
                k > 10 && (j = !1,
                k = 0),
                i = e;
            for ((0 === m || e > c) && (c = e),
            d = b - 1 > m && e > J + K * c ? !1 : !0,
            n = this.N - 1; n >= 0; n -= 1) {
                j && this.ntypes[n] == w && (h[n] = h[n] > y ? y : h[n],
                h[n] = h[n] < -y ? -y : h[n]),
                f[n] += h[n];
                var o = this.abstol[n] + H * this.soln_max[n];
                Math.abs(h[n]) > o && (d = !1,
                this.problem_node = n)
            }
            if (d === !0) {
                for (n = this.N - 1; n >= 0; n -= 1)
                    Math.abs(f[n]) > this.soln_max[n] && (this.soln_max[n] = Math.abs(f[n]));
                return m + 1
            }
        }
        return void 0
    }
    ,
    f.prototype.load_dc = function(a, b) {
        h(this.Gl, a, b, -1),
        j(this.Gl, this.G);
        for (var c = this.devices.length - 1; c >= 0; c -= 1)
            this.devices[c].load_dc(this, a, b);
        j(this.G, this.matrix)
    }
    ,
    f.prototype.dc = function(a) {
        if (this.finalize() === !1)
            return void 0;
        var b = this.find_solution(f.prototype.load_dc, C);
        if ("undefined" == typeof b) {
            if (a)
                throw this.current_sources.length > 0 ? "Unable to find circuit's operating point: do your current sources have a conductive path to ground?" : "Unable to find circuit's operating point: is there a loop in your circuit that's oscillating?";
            return !1
        }
        if (this.diddc = !0,
        a) {
            this.result = {};
            for (var c in this.node_map) {
                var d = this.node_map[c];
                this.result[c] = -1 == d ? 0 : this.solution[d]
            }
            for (var e = this.voltage_sources.length - 1; e >= 0; e -= 1) {
                var g = this.voltage_sources[e];
                this.result["I(" + g.name + ")"] = this.solution[g.branch]
            }
            return this.result._network_ = this,
            this.result
        }
        return !0
    }
    ,
    f.prototype.tran_start = function(a, b, c, d) {
        var e;
        for (this.diddc === !1 ? this.dc(!1) || (this.finalized = !1,
        this.finalize() === !1 && a.finish(void 0)) : this.finalize() === !1 && a.finish(void 0),
        this.response = new Array(this.N + 1),
        e = this.N; e >= 0; e -= 1)
            this.response[e] = [];
        for (this.old3sol = new Array(this.N),
        this.old3q = new Array(this.N),
        this.old2sol = new Array(this.N),
        this.old2q = new Array(this.N),
        this.oldsol = new Array(this.N),
        this.oldq = new Array(this.N),
        this.q = new Array(this.N),
        this.oldc = new Array(this.N),
        this.c = new Array(this.N),
        this.alpha0 = 1,
        this.alpha1 = 0,
        this.alpha2 = 0,
        this.beta0 = new Array(this.N),
        this.beta1 = new Array(this.N),
        this.ar = this.algebraic(this.C),
        this.ltecheck = new Array(this.N),
        e = this.N; e >= 0; e -= 1)
            this.ltecheck[e] = 0 === this.ar[e];
        for (var f in this.node_map) {
            var g = this.node_map[f];
            for (e = a.probe_names.length - 1; e >= 0; e -= 1)
                if (f == a.probe_names[e]) {
                    this.ltecheck[g] = !0;
                    break
                }
        }
        var h, i = d - c;
        for (e = this.voltage_sources.length - 1; e >= 0; e -= 1)
            h = this.voltage_sources[e].src.period,
            h > 0 && (i = Math.min(i, h));
        for (e = this.current_sources.length - 1; e >= 0; e -= 1)
            h = this.current_sources[e].src.period,
            h > 0 && (i = Math.min(i, h));
        for (this.periods = Math.ceil((d - c) / i),
        this.max_nsteps = 5e4 * this.periods,
        this.time = c,
        this.max_step = (d - c) / (this.periods * b),
        this.min_step = this.max_step / 1e8,
        this.new_step = this.max_step / 1e6,
        this.oldt = this.time - this.new_step,
        this.load_tran(this.solution, this.rhs),
        e = this.N - 1; e >= 0; e -= 1)
            this.old3sol[e] = this.solution[e],
            this.old2sol[e] = this.solution[e],
            this.oldsol[e] = this.solution[e],
            this.old3q[e] = this.q[e],
            this.old2q[e] = this.q[e],
            this.oldq[e] = this.q[e],
            this.oldc[e] = this.c[e];
        this.tstart = c,
        this.tstop = d,
        this.progress = a,
        this.step_index = -3;
        try {
            this.tran_steps((new Date).getTime() + a.update_interval)
        } catch (j) {
            a.finish(j)
        }
    }
    ,
    f.prototype.pick_step = function() {
        for (var a = 1 / F, b = E, c = this.time - this.oldt, d = this.time - this.old2t, e = this.time - this.old3t, f = this.oldt - this.old2t, g = this.oldt - this.old3t, h = this.old2t - this.old3t, i = d * e / (f * g), j = c * e / (-f * h), k = c * d / (g * h), l = .5 * (this.time - this.oldt) / (this.time - this.old3t), m = 0, n = this.N - 1; n >= 0; n -= 1)
            if (this.ltecheck[n]) {
                var o = i * this.oldsol[n] + j * this.old2sol[n] + k * this.old3sol[n]
                  , p = Math.abs(this.solution[n] - o) * l
                  , q = p / (I * (this.abstol[n] + H * this.soln_max[n]));
                m = Math.max(m, q)
            }
        var r, s = 1 / Math.pow(m, 1 / 3);
        return 1 > s ? (s = Math.max(s, a),
        r = .75 * (this.time - this.oldt) * s,
        r = Math.max(r, this.min_step)) : (s = Math.min(s, b),
        r = s > 1.2 ? (this.time - this.oldt) * s / 1.2 : this.time - this.oldt,
        r = Math.min(r, this.max_step)),
        r
    }
    ,
    f.prototype.load_tran = function(a, b) {
        h(this.Gl, a, this.c, -1),
        j(this.Gl, this.G);
        for (var c = this.devices.length - 1; c >= 0; c -= 1)
            this.devices[c].load_tran(this, a, this.c, this.time);
        for (h(this.C, a, this.q, 1),
        c = this.N - 1; c >= 0; c -= 1) {
            var d = this.alpha0 * this.q[c] + this.alpha1 * this.oldq[c] + this.alpha2 * this.old2q[c];
            b[c] = this.beta0[c] * this.c[c] + this.beta1[c] * this.oldc[c] - d
        }
        i(this.G, this.C, this.beta0, this.alpha0, this.matrix)
    }
    ,
    f.prototype.tran_steps = function(a) {
        var b;
        if (!this.progress.stop_requested)
            for (; this.step_index < this.max_nsteps; ) {
                for (b = this.N - 1; b >= 0; b -= 1)
                    this.step_index >= 0 && this.response[b].push(this.solution[b]),
                    this.oldc[b] = this.c[b],
                    this.old3sol[b] = this.old2sol[b],
                    this.old2sol[b] = this.oldsol[b],
                    this.oldsol[b] = this.solution[b],
                    this.old3q[b] = this.oldq[b],
                    this.old2q[b] = this.oldq[b],
                    this.oldq[b] = this.q[b];
                if (this.step_index < 0)
                    this.old3t = this.old2t - (this.oldt - this.old2t),
                    this.old2t = this.oldt - (this.tstart - this.oldt),
                    this.oldt = this.tstart - (this.time - this.oldt),
                    this.time = this.tstart,
                    this._beta0 = 1,
                    this._beta1 = 0;
                else {
                    if (this.response[this.N].push(this.time),
                    this.old3t = this.old2t,
                    this.old2t = this.oldt,
                    this.oldt = this.time,
                    this.time >= this.tstop)
                        break;
                    this.time + this.new_step > this.tstop ? this.time = this.tstop : this.time += this.time + 1.5 * this.new_step > this.tstop ? 2 / 3 * (this.tstop - this.time) : this.new_step,
                    this._beta0 = .5,
                    this._beta1 = .5
                }
                for (b = this.N - 1; b >= 0; b -= 1)
                    this.beta0[b] = this._beta0 + this.ar[b] * this._beta1,
                    this.beta1[b] = (1 - this.ar[b]) * this._beta1;
                for (; ; ) {
                    if (this.alpha0 = 1 / (this.time - this.oldt),
                    this.alpha1 = -this.alpha0,
                    this.alpha2 = 0,
                    this.time - this.oldt < 1e-4 * this.tstop)
                        for (b = this.N - 1; b >= 0; b -= 1)
                            this.beta0[b] = 1,
                            this.beta1[b] = 0;
                    var c = this.find_solution(f.prototype.load_tran, D);
                    if (void 0 !== c && (this.step_index <= 0 || this.time - this.oldt < (1 + H) * this.min_step)) {
                        this.step_index > 0 && (this.new_step = E * this.min_step);
                        break
                    }
                    if (void 0 === c)
                        this.time = this.oldt + (this.time - this.oldt) / G;
                    else {
                        if (this.new_step = this.pick_step(),
                        !(this.new_step < (1 - H) * (this.time - this.oldt)))
                            break;
                        this.time = this.oldt + this.new_step
                    }
                }
                this.step_index += 1;
                var d = (new Date).getTime();
                if (d >= a) {
                    var e = Math.round(100 * (this.time - this.tstart) / (this.tstop - this.tstart));
                    this.progress.update(e);
                    var g = this;
                    return void setTimeout(function() {
                        try {
                            g.tran_steps(d + g.progress.update_interval)
                        } catch (a) {
                            g.progress.finish(a)
                        }
                    }
                    , 1)
                }
            }
        this.result = {};
        for (var h in this.node_map) {
            var i = this.node_map[h];
            this.result[h] = -1 == i ? 0 : this.response[i]
        }
        for (b = this.voltage_sources.length - 1; b >= 0; b -= 1) {
            var j = this.voltage_sources[b];
            this.result["I(" + j.name + ")"] = this.response[j.branch]
        }
        throw this.result._xvalues_ = this.response[this.N],
        this.result._network_ = this,
        this.result
    }
    ,
    f.prototype.ac = function(a, b, c, d) {
        var e;
        this.dc(!0);
        var f = this.N
          , h = this.G
          , i = this.C
          , j = g(2 * f, 2 * f + 1);
        if (d = d.toLowerCase(),
        void 0 === this.device_map[d])
            throw "AC analysis refers to unknown source " + d;
        this.device_map[d].load_ac(this, this.rhs);
        var k = new Array(2 * f + 1);
        for (e = 2 * f; e >= 0; e -= 1)
            k[e] = [];
        var l = Math.exp(Math.LN10 / a)
          , n = new Array(f);
        for (e = f - 1; e >= 0; e -= 1)
            n[e] = 0;
        var o = b;
        for (c *= 1.0001; c >= o; ) {
            var p = 2 * Math.PI * o;
            for (k[2 * f].push(o),
            e = f - 1; e >= 0; e -= 1) {
                j[e][2 * f] = this.rhs[e],
                j[e + f][2 * f] = 0;
                for (var q = f - 1; q >= 0; q -= 1)
                    j[e][q] = h[e][q],
                    j[e + f][q + f] = h[e][q],
                    j[e][q + f] = -p * i[e][q],
                    j[e + f][q] = p * i[e][q]
            }
            var r = m(j, null );
            for (e = f - 1; e >= 0; e -= 1) {
                var s = Math.sqrt(r[e] * r[e] + r[e + f] * r[e + f]);
                k[e].push(s);
                var t = 180 * (Math.atan2(r[e + f], r[e]) / Math.PI)
                  , u = k[e + f]
                  , v = u.length;
                if (v > 1) {
                    var w = t + n[e] - u[v - 1];
                    w > 90 ? n[e] -= 360 : -90 > w && (n[e] += 360)
                }
                k[e + f].push(t + n[e])
            }
            o *= l
        }
        this.result = {};
        for (var x in this.node_map) {
            var y = this.node_map[x];
            this.result[x] = {
                magnitude: -1 == y ? 0 : k[y],
                phase: -1 == y ? 0 : k[y + f]
            }
        }
        return this.result._frequencies_ = k[2 * f],
        this.result._network_ = this,
        this.result
    }
    ,
    f.prototype.add_device = function(a, b) {
        return this.devices.push(a),
        a.name = b,
        b && (this.device_map[b] = a),
        a
    }
    ,
    f.prototype.r = function(a, b, c, d) {
        if (0 !== c) {
            var e = new q(a,b,c);
            return this.add_device(e, d)
        }
        return this.v(a, b, "0", d)
    }
    ,
    f.prototype.d = function(a, b, c, d, e) {
        if (0 !== c) {
            var f = new r(a,b,c,d);
            return this.add_device(f, e)
        }
        return void 0
    }
    ,
    f.prototype.c = function(a, b, c, d) {
        var e = new s(a,b,c);
        return this.add_device(e, d)
    }
    ,
    f.prototype.l = function(a, b, c, d) {
        var e = this.node(void 0, x)
          , f = new t(a,b,e,c);
        return this.add_device(f, d)
    }
    ,
    f.prototype.v = function(a, b, c, d) {
        var e = this.node(void 0, x)
          , f = new o(a,b,e,c);
        return this.voltage_sources.push(f),
        this.add_device(f, d)
    }
    ,
    f.prototype.i = function(a, b, c, d) {
        var e = new p(a,b,c);
        return this.current_sources.push(e),
        this.add_device(e, d)
    }
    ,
    f.prototype.opamp = function(a, b, c, d, e, f) {
        var g = this.node(void 0, x)
          , h = new u(a,b,c,d,g,e,f);
        return this.add_device(h, f)
    }
    ,
    f.prototype.n = function(a, b, c, d, e, f) {
        var g = new v(a,b,c,d,e,f,"n");
        return this.add_device(g, f)
    }
    ,
    f.prototype.p = function(a, b, c, d, e, f) {
        var g = new v(a,b,c,d,e,f,"p");
        return this.add_device(g, f)
    }
    ,
    f.prototype.add_two_terminal = function(a, b, c, d) {
        a >= 0 ? (d[a][a] += c,
        b >= 0 && (d[a][b] -= c,
        d[b][a] -= c,
        d[b][b] += c)) : b >= 0 && (d[b][b] += c)
    }
    ,
    f.prototype.get_two_terminal = function(a, b, c) {
        var d = 0;
        return a >= 0 && (d = c[a]),
        b >= 0 && (d -= c[b]),
        d
    }
    ,
    f.prototype.add_conductance_l = function(a, b, c) {
        this.add_two_terminal(a, b, c, this.Gl)
    }
    ,
    f.prototype.add_conductance = function(a, b, c) {
        this.add_two_terminal(a, b, c, this.G)
    }
    ,
    f.prototype.add_capacitance = function(a, b, c) {
        this.add_two_terminal(a, b, c, this.C)
    }
    ,
    f.prototype.add_to_Gl = function(a, b, c) {
        a >= 0 && b >= 0 && (this.Gl[a][b] += c)
    }
    ,
    f.prototype.add_to_G = function(a, b, c) {
        a >= 0 && b >= 0 && (this.G[a][b] += c)
    }
    ,
    f.prototype.add_to_C = function(a, b, c) {
        a >= 0 && b >= 0 && (this.C[a][b] += c)
    }
    ,
    f.prototype.add_to_rhs = function(a, b, c) {
        a >= 0 && (c[a] += b)
    }
    ,
    f.prototype.algebraic = function(a) {
        var b = a.length
          , c = g(b, b);
        j(a, c);
        for (var d, e = k(c), f = new Array(b), h = 0; b > h; h += 1) {
            for (d = b - 1; d >= 0; d -= 1)
                c[h][d] = 0;
            if (k(c) == e)
                f[h] = 1;
            else {
                for (d = b - 1; d >= 0; d -= 1)
                    c[h][d] = a[h][d];
                f[h] = 0
            }
        }
        return f
    }
    ,
    n.prototype.finalize = function() {}
    ,
    n.prototype.load_linear = function() {}
    ,
    n.prototype.load_dc = function() {}
    ,
    n.prototype.load_tran = function() {}
    ,
    n.prototype.load_ac = function() {}
    ,
    o.prototype = new n,
    o.prototype.constructor = o,
    o.prototype.load_linear = function(a) {
        a.add_to_Gl(this.branch, this.npos, 1),
        a.add_to_Gl(this.branch, this.nneg, -1),
        a.add_to_Gl(this.npos, this.branch, 1),
        a.add_to_Gl(this.nneg, this.branch, -1)
    }
    ,
    o.prototype.load_dc = function(a, b, c) {
        a.add_to_rhs(this.branch, this.src.dc, c)
    }
    ,
    o.prototype.load_tran = function(a, b, c, d) {
        a.add_to_rhs(this.branch, this.src.value(d), c)
    }
    ,
    o.prototype.load_ac = function(a, b) {
        a.add_to_rhs(this.branch, 1, b)
    }
    ,
    p.prototype = new n,
    p.prototype.constructor = p,
    p.prototype.load_linear = function() {}
    ,
    p.prototype.load_dc = function(a, b, c) {
        var d = this.src.dc;
        a.add_to_rhs(this.npos, -d, c),
        a.add_to_rhs(this.nneg, d, c)
    }
    ,
    p.prototype.load_tran = function(a, b, c, d) {
        var e = this.src.value(d);
        a.add_to_rhs(this.npos, -e, c),
        a.add_to_rhs(this.nneg, e, c)
    }
    ,
    p.prototype.load_ac = function(a, b) {
        a.add_to_rhs(this.npos, -1, b),
        a.add_to_rhs(this.nneg, 1, b)
    }
    ,
    q.prototype = new n,
    q.prototype.constructor = q,
    q.prototype.load_linear = function(a) {
        a.add_conductance_l(this.n1, this.n2, this.g)
    }
    ,
    q.prototype.load_dc = function() {}
    ,
    q.prototype.load_tran = function() {}
    ,
    q.prototype.load_ac = function() {}
    ,
    r.prototype = new n,
    r.prototype.constructor = r,
    r.prototype.load_linear = function() {}
    ,
    r.prototype.load_dc = function(a, b, c) {
        var d, e, f = a.get_two_terminal(this.anode, this.cathode, b), g = f / this.vt, h = Math.abs(g), i = h - this.exp_arg_max;
        if (i > 0) {
            var j = 1 + i + .5 * i * i;
            d = this.exp_max * j,
            e = this.exp_max * (1 + i)
        } else
            d = Math.exp(h),
            e = d;
        0 > g && (d = 1 / d,
        e = d * e * d);
        var k = this.ais * (d - 1)
          , l = this.ais * (e / this.vt);
        a.add_to_rhs(this.anode, -k, c),
        a.add_to_rhs(this.cathode, k, c),
        a.add_conductance(this.anode, this.cathode, l)
    }
    ,
    r.prototype.load_tran = function(a, b, c) {
        this.load_dc(a, b, c)
    }
    ,
    r.prototype.load_ac = function() {}
    ,
    s.prototype = new n,
    s.prototype.constructor = s,
    s.prototype.load_linear = function(a) {
        a.add_capacitance(this.n1, this.n2, this.value)
    }
    ,
    s.prototype.load_dc = function() {}
    ,
    s.prototype.load_ac = function() {}
    ,
    s.prototype.load_tran = function() {}
    ,
    t.prototype = new n,
    t.prototype.constructor = t,
    t.prototype.load_linear = function(a) {
        a.add_to_Gl(this.n1, this.branch, 1),
        a.add_to_Gl(this.n2, this.branch, -1),
        a.add_to_Gl(this.branch, this.n1, -1),
        a.add_to_Gl(this.branch, this.n2, 1),
        a.add_to_C(this.branch, this.branch, this.value)
    }
    ,
    t.prototype.load_dc = function() {}
    ,
    t.prototype.load_ac = function() {}
    ,
    t.prototype.load_tran = function() {}
    ,
    u.prototype = new n,
    u.prototype.constructor = u,
    u.prototype.load_linear = function(a) {
        var b = 1 / this.gain;
        a.add_to_Gl(this.no, this.branch, 1),
        a.add_to_Gl(this.ng, this.branch, -1),
        a.add_to_Gl(this.branch, this.no, b),
        a.add_to_Gl(this.branch, this.ng, -b),
        a.add_to_Gl(this.branch, this.np, -1),
        a.add_to_Gl(this.branch, this.nn, 1)
    }
    ,
    u.prototype.load_dc = function() {}
    ,
    u.prototype.load_ac = function() {}
    ,
    u.prototype.load_tran = function() {}
    ,
    v.prototype = new n,
    v.prototype.constructor = v,
    v.prototype.load_linear = function(a) {
        a.add_conductance_l(this.d, this.s, this.g_leak);
        var b = .25 * this.W
          , c = 1;
        a.add_capacitance(this.d, a.gnd_node(), 2e-15 * b * c + 5e-16 * (b + 2 * c)),
        a.add_capacitance(this.s, a.gnd_node(), 2e-15 * b * c + 5e-16 * (b + 2 * c)),
        c = .25 * this.L,
        a.add_capacitance(this.g, a.gnd_node(), 6e-15 * b * c)
    }
    ,
    v.prototype.load_dc = function(a, b, c) {
        var d = this.type_sign * a.get_two_terminal(this.d, this.s, b);
        if (0 > d) {
            var e = this.d;
            this.d = this.s,
            this.s = e,
            d = this.type_sign * a.get_two_terminal(this.d, this.s, b)
        }
        var f, g, h, i = this.type_sign * a.get_two_terminal(this.g, this.s, b), j = i - this.vt;
        j > 0 && (d > j ? (f = this.beta * (1 + this.lambda * d) * j,
        g = .5 * this.type_sign * f * j,
        h = .5 * this.beta * j * j * this.lambda) : (f = this.beta * (1 + this.lambda * d),
        g = this.type_sign * f * d * (j - .5 * d),
        h = f * (j - d) + this.beta * this.lambda * d * (j - .5 * d),
        f *= d),
        a.add_to_rhs(this.d, -g, c),
        a.add_to_rhs(this.s, g, c),
        a.add_conductance(this.d, this.s, h),
        a.add_to_G(this.s, this.s, f),
        a.add_to_G(this.d, this.s, -f),
        a.add_to_G(this.d, this.g, f),
        a.add_to_G(this.s, this.g, -f))
    }
    ,
    v.prototype.load_tran = function(a, b, c) {
        this.load_dc(a, b, c)
    }
    ,
    v.prototype.load_ac = function() {}
    ;
    var L = {
        Circuit: f,
        dc_analysis: c,
        ac_analysis: d,
        transient_analysis: e,
        print_netlist: b
    };
    return L
}
,
jade_defs.gate_level = function(a) {
    function b(b) {
        var c = b.match(/(\w+)\s*\((.*?)\)\s*/)
          , d = $.map(c[2].split(","), a.utils.parse_number);
        return {
            type: c[1],
            args: d
        }
    }
    function c(a, b) {
        var c;
        try {
            c = d(a.aspect, b)
        } catch (e) {
            throw a.redraw_background(),
            e
        }
        return c
    }
    function d(c, d) {
        var e = ["ground", "jumper", "memory", "/analog/v_source", "/analog/v_probe"];
        a.model.map_modules(/^\/gates\/.*/, function(a) {
            e.push(a.get_name())
        }
        );
        var f = c.netlist(e, d, "", {}, [])
          , g = [];
        return $.each(f, function(c, d) {
            var e = d[0]
              , f = d[1]
              , h = d[2];
            if (/^\/gates\/.*/.test(e)) {
                var j = {
                    name: h.name
                };
                $.each(i, function(b, c) {
                    var d = h[c];
                    d && (j[c] = a.utils.parse_number(d))
                }
                ),
                g.push({
                    type: e.split("/")[2],
                    connections: f,
                    properties: j
                })
            } else if ("/analog/v_source" == e)
                g.push({
                    type: "voltage source",
                    connections: f,
                    properties: {
                        name: h.name,
                        value: b(h.value)
                    }
                });
            else if ("ground" == e)
                g.push({
                    type: "ground",
                    connections: [f.gnd],
                    properties: {}
                });
            else if ("jumper" == e) {
                var k = [];
                $.each(f, function(a, b) {
                    k.push(b)
                }
                ),
                g.push({
                    type: "connect",
                    connections: k,
                    properties: {}
                })
            } else
                "/analog/v_probe" == e ? g.push({
                    type: "voltage probe",
                    connections: f,
                    properties: {
                        name: h.name,
                        color: h.color,
                        offset: a.utils.parse_number(h.offset)
                    }
                }) : "memory" == e && g.push({
                    type: "memory",
                    connections: f,
                    properties: h
                })
        }
        ),
        g
    }
    function e(b) {
        b.remove_annotations();
        var d, e = "Stop Time (seconds)";
        try {
            if (d = c(b, []),
            0 === find_probes(d).length)
                throw "There are no probes in the diagram!"
        } catch (g) {
            return void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(g), $(b.canvas).offset())
        }
        var h = b.aspect.module
          , i = {};
        i[e] = a.build_input("text", 10, h.properties.tran_tstop);
        var j = a.build_table(i);
        b.dialog("Transient Analysis", j, function() {
            h.set_property("tran_tstop", i[e].value);
            var c = a.utils.parse_number_alert(h.properties.tran_tstop);
            if (d.length > 0 && void 0 !== c) {
                for (var g = find_probes(d), j = {}, k = g.length - 1; k >= 0; k -= 1)
                    j[k] = g[k][1];
                var l = a.progress_report();
                b.window("Progress", l),
                a.gatesim.transient_analysis(d, c, j, function(c, d) {
                    return void 0 === d ? (l[0].update_progress(c),
                    l[0].stop_requested) : (a.window_close(l.win),
                    void f(d, b, g))
                }
                , b.editor.options)
            }
        }
        )
    }
    function f(b, c, d) {
        var e;
        if ("string" == typeof b)
            c.message("Error during Transient analysis:\n\n" + b);
        else if (void 0 === b)
            c.message("Sorry, no results from transient analysis to plot!");
        else {
            for (var f = [], g = d.length - 1; g >= 0; g -= 1) {
                var h = d[g][0]
                  , i = d[g][1];
                e = b[i],
                void 0 === e ? c.message("The " + h + ' probe is connected to node "' + i + '" which is not an actual circuit node') : "x-axis" != h && f.push({
                    xvalues: [e.xvalues],
                    yvalues: [e.yvalues],
                    name: [i],
                    color: [h],
                    xunits: "s",
                    type: ["digital"]
                })
            }
            var j = a.plot.graph(f);
            c.window("Results of Gate-level simulation", j)
        }
    }
    function g(a, b, c) {
        if (void 0 === c)
            return void 0;
        for (var d = 0; d < b.length; d += 1)
            if (a < b[d])
                return c[d - 1];
        return void 0
    }
    function h(b) {
        var d;
        try {
            d = c(b, ["gnd", "vdd"])
        } catch (e) {
            return void a.window("Errors extracting netlist", $('<div class="jade-alert"></div>').html(e), $(b.canvas).offset())
        }
        var f;
        try {
            f = a.gatesim.timing_analysis(d, b.editor.options),
            f = $('<pre style="width:600px;height:400px;padding:5px;overflow-y:auto;overflow-x:hidden;"></pre>').append(f),
            f = f[0],
            f.resize = function(a, b, c) {
                $(a).height(c),
                $(a).width(b)
            }
            ,
            a.window("Timing analysis", f, $(b.canvas).offset())
        } catch (e) {
            a.window("Errors during timing analysis", $('<div class="jade-alert"></div>').html(e), $(b.canvas).offset())
        }
    }
    var i = ["tcd", "tpd", "tr", "tf", "cin", "size", "ts", "th"];
    return a.schematic_view.schematic_tools.push(["gate", a.icons.gate_icon, "Gate-level simulation", e]),
    a.schematic_view.schematic_tools.push(["timing", a.icons.timing_icon, "Gate-level timing analysis", h]),
    {
        diagram_gate_netlist: c,
        interpolate: g
    }
}
,
jade_defs.gatesim = function(a) {
    function b() {
        return q
    }
    function c() {
        throw "Sorry, no DC analysis with gate-level simulation"
    }
    function d() {
        throw "Sorry, no AC analysis with gate-level simulation"
    }
    function e(a, b, c, d, e) {
        if (a.length > 0 && void 0 !== b) {
            var f = new g(a,e || {})
              , h = {};
            h.update_interval = 250,
            h.finish = function(a) {
                d(void 0, f, a)
            }
            ,
            h.stop_requested = !1,
            h.update = function(a) {
                d(a, void 0, void 0) && (h.stop_requested = !0)
            }
            ,
            setTimeout(function() {
                try {
                    f.initialize(h, b),
                    f.simulate((new Date).getTime() + f.progress.update_interval)
                } catch (a) {
                    h.finish(a)
                }
            }
            , 1)
        }
    }
    function f(a, b, c) {
        function d(a, b, d, e) {
            if (0 == d.length)
                return e;
            e && (e += "<p><hr><p>"),
            e += "Worst-case t<sub>PD</sub> from " + a + " to " + b + "\n",
            d.sort(function(a, b) {
                return b.pd_sum - a.pd_sum
            }
            );
            for (var f = 0; c > f && f < d.length; f += 1)
                i = d[f],
                e += "<p>  t<sub>PD</sub> from " + i.get_tpd_source().name + " to " + i.name + " (" + (1e9 * i.pd_sum).toFixed(3) + "ns):",
                e += " <button onclick=\"$('#detail" + k + '\').toggle()">Details</button>\n<div id="detail' + k + '" style="display:none;">',
                e += i.describe_tpd(),
                e += "<br></div>",
                k += 1;
            return e
        }
        void 0 === b && (b = {}),
        void 0 === c && (c = 10),
        b.timing_analysis = !0;
        var e, f = new g(a,b);
        try {
            e = f.get_timing_info()
        } catch (h) {
            return "\n\nOops, timing analysis failed:\n" + h
        }
        var i, j, k = 0, l = "";
        return $.each(e.clocks, function(a, b) {
            var c = [];
            j = [],
            $.each(b.fanouts, function(a, d) {
                if (i = d.get_clock_info(b),
                void 0 !== i) {
                    var e = i.get_tpd_source().node;
                    e == b && j.push(i),
                    !e.is_input() && i.cd_sum < 0 && c.push(i)
                }
            }
            ),
            l = d(b.name + "\u2191", b.name + "\u2191", j, l),
            c.length > 0 && (l && (l += "<p><hr><p>"),
            l += "Hold-time violations for " + b.name + "\u2191:\n",
            $.each(c, function(a, b) {
                l += "\n  tCD from " + b.get_tcd_source().name + " to " + b.cd_link.name + " violates hold time by " + (1e9 * b.cd_sum).toFixed(3) + "ns:\n",
                l += b.describe_tcd()
            }
            )),
            j = [],
            $.each(e.timing, function(a, c) {
                c.get_tpd_source().node == b && c.node.is_output() && j.push(c)
            }
            ),
            l = d(b.name + "\u2191", "top-level outputs", j, l)
        }
        ),
        j = [],
        $.each(e.timing, function(a, b) {
            b.node.is_output() && !b.get_tpd_source().node.clock && j.push(b)
        }
        ),
        l = d("inputs", "top-level outputs", j, l)
    }
    function g(a, b) {
        this.N = 0,
        this.node_map = {},
        this.aliases = {},
        this.nodes = [],
        this.devices = [],
        this.device_map = {},
        this.event_queue = new i,
        this.options = b || {},
        this.debug_level = this.options.debug || 0,
        this._network_ = this,
        void 0 !== a && this.load_netlist(a, b)
    }
    function h(a, b, c, d) {
        this.time = a,
        this.type = b,
        this.node = c,
        this.v = d
    }
    function i() {
        this.nodes = []
    }
    function j(a, b) {
        this.name = a,
        this.network = b,
        this.drivers = [],
        this.driver = void 0,
        this.fanouts = [],
        this.capacitance = 0
    }
    function k(b, c, d, e) {
        this.type = "voltage source",
        this.network = b,
        this.name = c,
        this.output = d,
        this.vil = b.options.vil || .1,
        this.vih = b.options.vih || .9;
        var f = a.utils.parse_source(e.value);
        if ("sin" == f.fun)
            throw "Can't use sin() sources in gate-level simulation";
        if ("dc" == f.fun)
            d.constant_value = !0,
            this.tvpairs = [0, f.args[0]],
            this.period = 0;
        else if (this.tvpairs = f.tvpairs,
        this.period = f.period,
        0 !== this.period) {
            this.tvpairs = this.tvpairs.slice(0);
            for (var g = 0; g < f.tvpairs.length; g += 2)
                this.tvpairs.push(f.tvpairs[g] + this.period),
                this.tvpairs.push(f.tvpairs[g + 1])
        }
        this.initial_value = this.tvpairs[1] <= this.vil ? t : this.tvpairs[1] >= this.vih ? u : v,
        d.add_fanout(this),
        d.add_driver(this),
        b.add_component(this)
    }
    function l(a, b, c, d, e, f, g) {
        this.network = a,
        this.type = b,
        this.name = c,
        this.table = d,
        this.inputs = e,
        this.output = f,
        this.properties = g,
        this.size = g.size || 0,
        this.lenient = void 0 === g.lenient ? !0 : 0 !== g.lenient,
        e.length < 2 && (this.lenient = !0),
        0 === e.length && (f.constant_value = !0),
        this.cout = g.cout || 0,
        this.cin = g.cin || 0,
        this.tcd = g.tcd || 0,
        this.tpdf = g.tpdf || g.tpd || 0,
        this.tpdr = g.tpdr || g.tpd || 0,
        this.tr = g.tr || 0,
        this.tf = g.tf || 0;
        for (var h = 0; h < e.length; h += 1)
            e[h].add_fanout(this);
        f.add_driver(this);
        var i = e[0]
          , j = e[1]
          , k = e[2]
          , l = e[3]
          , m = e[4]
          , n = e[5];
        this.logic_eval = 0 === e.length ? function() {
            return d[4]
        }
         : 1 == e.length ? function() {
            return d[i.v][4]
        }
         : 2 == e.length ? function() {
            return d[i.v][j.v][4]
        }
         : 3 == e.length ? function() {
            return d[i.v][j.v][k.v][4]
        }
         : 4 == e.length ? function() {
            return d[i.v][j.v][k.v][l.v][4]
        }
         : 5 == e.length ? function() {
            return d[i.v][j.v][k.v][l.v][m.v][4]
        }
         : 6 == e.length ? function() {
            return "mux4" == b && (i.v >= v || j.v >= v) ? i.v >= v ? j.v >= v ? k.v == l.v && k.v == m.v && k.v == n.v ? k.v : v : j.v == t ? k.v == l.v ? k.v : v : m.v == n.v ? m.v : v : i.v == t ? k.v == m.v ? k.v : v : l.v == n.v ? l.v : v : d[i.v][j.v][k.v][l.v][m.v][n.v][4]
        }
         : function() {
            for (var a = d, b = 0; b < e.length; b += 1)
                a = a[e[b].v];
            return a[4]
        }
        ,
        a.add_component(this)
    }
    function m(a, b, c, d, e) {
        this.network = a,
        this.name = b,
        this.type = c,
        this.size = e.size || 0,
        this.d = d.d,
        this.clk = "dreg" == c ? d.clk : d.g,
        this.q = d.q,
        this.d.add_fanout(this),
        this.clk.add_fanout(this),
        this.q.add_driver(this),
        "dreg" == c && (this.clk.clock = !0),
        this.gate_open = "dlatch" == c ? u : t,
        this.gate_closed = "dlatch" == c ? t : u,
        this.properties = e,
        this.lenient = void 0 === e.lenient ? !1 : 0 !== e.lenient,
        this.cout = e.cout || 0,
        this.cin = e.cin || 0,
        this.tcd = e.tcd || 0,
        this.tpdf = e.tpdf || e.tpd || 0,
        this.tpdr = e.tpdr || e.tpd || 0,
        this.tr = e.tr || 0,
        this.tf = e.tf || 0,
        this.ts = e.ts || 0,
        this.th = e.th || 0,
        a.add_component(this)
    }
    function n(a, b, c, d) {
        var e = this;
        if (e.type = "memory",
        e.network = a,
        e.name = b,
        e.width = c.width,
        void 0 === e.width || e.width <= 0)
            throw "Memory " + b + " must have width > 0.";
        if (e.nlocations = c.nlocations,
        void 0 === e.nlocations || e.nlocations <= 0)
            throw "Memory " + b + " must have > 0 locations.";
        e.contents = c.contents,
        e.lenient = void 0 === c.lenient ? !0 : 0 !== c.lenient,
        e.cout = c.cout || d.mem_cout || 0,
        e.cin = c.cin || d.mem_cin || 5e-15,
        e.tcd = c.tcd || d.mem_tcd || 2e-11,
        e.tr = c.tr || d.mem_tr || 1e3,
        e.tf = c.tf || d.mem_tf || 500,
        e.ts = c.ts || d.mem_ts || 2 * e.tcd,
        e.th = c.th || d.mem_th || e.tcd,
        e.nlocations > 1024 ? (e.tpdf = c.tpdf || c.tpd || d.mem_tpdf_dram || d.mem_tpd_dram || 4e-8,
        e.tpdr = c.tpdr || c.tpd || d.mem_tpdr_dram || d.mem_tpd_dram || 4e-8) : e.nlocations > 128 ? (e.tpdf = c.tpdf || c.tpd || d.mem_tpdf_sram || d.mem_tpd_sram || 4e-9,
        e.tpdr = c.tpdr || c.tpd || d.mem_tpdr_sram || d.mem_tpd_sram || 4e-9) : (e.tpdf = c.tpdf || c.tpd || d.mem_tpdf_regfile || d.mem_tpd_regfile || 2e-9,
        e.tpdr = c.tpdr || c.tpd || d.mem_tpdr_regfile || d.mem_tpd_regfile || 2e-9),
        e.ports = c.ports || [],
        e.tristate_outputs = [],
        e.n_read_ports = 0,
        e.n_write_ports = 0,
        e.naddr = 0,
        $.each(e.ports, function(b, c) {
            c.clk.add_fanout(e),
            c.wen.add_fanout(e),
            c.oe.add_fanout(e),
            $.each(c.addr, function(a, b) {
                b.add_fanout(e)
            }
            ),
            e.naddr = c.addr.length,
            (c.clk != a.gnd || c.wen != a.gnd) && (e.n_write_ports += 1,
            c.write_port = !0,
            $.each(c.data, function(a, b) {
                b.add_fanout(e)
            }
            )),
            c.oe != a.gnd && (e.n_read_ports += 1,
            c.read_port = !0,
            $.each(c.data, function(a, b) {
                b.add_driver(e),
                -1 == e.tristate_outputs.indexOf(b) && e.tristate_outputs.push(b)
            }
            ))
        }
        ),
        e.bits = new Uint8Array(e.nlocations * e.width);
        var f;
        f = 1 == e.n_read_ports && 0 == e.n_write_ports ? 0 : e.nlocations <= 1024 ? d.mem_size_sram || 5 : 0,
        f += e.ports.length * (d.mem_size_access || 1),
        e.size = e.nlocations * e.width * f,
        e.size += e.ports.length * e.naddr * (d.mem_size_address_buffer || 20),
        e.size += e.ports.length * e.naddr * (d.mem_size_address_decoder || 4),
        e.size += e.n_read_ports * e.width * (d.mem_size_output_buffer || 30),
        e.size += e.n_write_ports * e.width * (d.mem_size_write_buffer || 20),
        a.add_component(this)
    }
    function o(a, b, c, d, e) {
        this.name = a,
        this.node = b,
        this.device = c,
        this.cd_sum = 0,
        this.cd_link = void 0,
        this.pd_sum = 0,
        this.pd_link = void 0,
        this.tcd = d || 0,
        this.tpd = e || 0
    }
    function p(a, b, c) {
        for (var d = a.toFixed(c); d.length < b; )
            d = " " + d;
        return d
    }
    var q;
    g.prototype.unalias = function(a) {
        for (; void 0 !== this.aliases[a]; )
            a = this.aliases[a];
        return a
    }
    ,
    g.prototype.make_alias = function(a, b) {
        if (a = this.unalias(a),
        b = this.unalias(b),
        a != b) {
            var c, d, e = (a.match(/\./g) || []).length, f = (b.match(/\./g) || []).length;
            "gnd" == a ? (c = a,
            d = b) : "gnd" == b ? (c = b,
            d = a) : f > e ? (c = a,
            d = b) : e > f ? (c = b,
            d = a) : a.length <= b.length ? (c = a,
            d = b) : (c = b,
            d = a),
            this.aliases[d] = c
        }
    }
    ,
    g.prototype.node = function(a) {
        a = this.unalias(a);
        var b = this.node_map[a];
        return void 0 === b && (b = new j(a,this),
        this.node_map[a] = b,
        this.nodes.push(b),
        this.N += 1),
        b
    }
    ,
    g.prototype.load_netlist = function(a, b) {
        q = this;
        var c = this;
        c.N = 0,
        c.node_map = {},
        c.aliases = {},
        c.nodes = [],
        c.devices = [],
        c.device_map = {},
        c.size = 0,
        c.counts = {},
        c.sizes = {},
        c.gnd = c.node("gnd"),
        c.devices.push(new k(c,"gnd",c.gnd,{
            name: "gnd",
            value: {
                type: "dc",
                args: []
            }
        })),
        $.each(a, function(a, b) {
            "ground" == b.type && (c.node_map[b.connections.gnd] = c.gnd)
        }
        ),
        $.each(a, function(a, b) {
            if ("connect" == b.type) {
                var d = [];
                $.each(b.connections, function(a, b) {
                    d.push(b)
                }
                );
                for (var e = 1; e < d.length; e += 1)
                    c.make_alias(d[0], d[e])
            }
        }
        ),
        $.each(a, function(a, d) {
            var e, f = d.type;
            if ("ground" != f && "connect" != f) {
                var g = d.connections
                  , h = d.properties
                  , i = h.name;
                for (var j in g)
                    g[j] = c.node(g[j]);
                if (f in db) {
                    var o = db[f]
                      , p = [];
                    $.each(o[0], function(a, b) {
                        p.push(g[b])
                    }
                    ),
                    new l(c,f,i,o[2],p,g[o[1]],h)
                } else if ("dreg" == f || "dlatch" == f || "dlatchn" == f)
                    new m(c,i,f,g,h);
                else if ("memory" == f)
                    $.each(h.ports, function(a, b) {
                        $.each(b.addr, function(a, d) {
                            b.addr[a] = c.node(d)
                        }
                        ),
                        $.each(b.data, function(a, d) {
                            b.data[a] = c.node(d)
                        }
                        ),
                        b.data_out = b.data.slice(0),
                        b.clk = c.node(b.clk),
                        b.wen = c.node(b.wen),
                        b.oe = c.node(b.oe)
                    }
                    ),
                    new n(c,i,h,b);
                else if ("constant0" == f || "constant1" == f) {
                    if (e = g.z,
                    e.drivers.length > 0)
                        return;
                    e.v = "constant0" == f ? t : u,
                    new l(c,f,i,"constant0" == f ? z : A,[],e,h)
                } else {
                    if ("voltage source" != f)
                        throw "Unrecognized gate: " + f;
                    if (e = g.nplus,
                    e.drivers.length > 0)
                        return;
                    new k(c,i,e,h)
                }
            }
        }
        ),
        $.each(c.node_map, function(a, b) {
            b.finalize()
        }
        )
    }
    ,
    g.prototype.report = function() {
        var a = this
          , b = $('<div style="padding:5px"></div>')
          , c = 1e-10 / (1e-12 * a.size * a.time);
        b.append("Benmark: " + c.toFixed(2));
        var d = void 0
          , e = void 0
          , f = void 0;
        $.each(a.devices, function(a, b) {
            b.min_setup && (void 0 === d || b.min_setup < d) && (d = b.min_setup,
            e = b.min_setup_time,
            f = b.name)
        }
        ),
        d && b.append("<p>Min observed setup time: " + (1e9 * d).toFixed(2) + "ns at time=" + (1e9 * e).toFixed(0) + "ns for device " + f);
        var g = $('<table class="size-table" border="1" cellpadding="3" style="border-collapse:collapse"><tr><th>Component</th><th>Count</th><th>Size (\u03bc\xb2)</th></tr></table>');
        g.append('<tr><td><i>nodes</i></td><td class="number">' + this.N + "</td><td></td></tr>");
        var h = 0
          , i = [];
        $.each(a.counts, function(a, b) {
            i.push(a),
            h += b
        }
        ),
        i.sort();
        var j, h = 0;
        return $.each(i, function(b, c) {
            h += a.counts[c],
            j = a.sizes[c],
            void 0 === j && (j = ""),
            g.append("<tr><td>" + c + '</td><td class="number">' + a.counts[c] + '</td><td class="number">' + j + "</td></tr>")
        }
        ),
        g.append('<tr><td><b>Totals</b></td><td class="number"><b>' + h + '</b></td><td class="number"><b>' + a.size + "</b></td></tr>"),
        b.append("<p>", g),
        b
    }
    ,
    g.prototype.add_component = function(a) {
        var b = a.type;
        this.devices.push(a),
        this.counts[b] = (this.counts[b] || 0) + 1,
        a.name && (this.device_map[a.name] = a),
        a.size && (this.size += a.size,
        this.sizes[b] = (this.sizes[b] || 0) + a.size)
    }
    ,
    g.prototype.initialize = function(a, b) {
        this.progress = a,
        this.tstop = b,
        this.event_queue.clear(),
        this.time = 0;
        var c;
        for (c = 0; c < this.nodes.length; c += 1)
            this.nodes[c].initialize();
        for (c = 0; c < this.devices.length; c += 1)
            this.devices[c].initialize()
    }
    ,
    g.prototype.simulate = function(a) {
        var b = 0;
        if (!this.progress.stop_requested) {
            for (; this.time < this.tstop && !this.event_queue.empty(); ) {
                var c = this.event_queue.pop();
                if (this.time = c.time,
                c.node.process_event(c),
                !(++b < 1e3)) {
                    b = 0;
                    var d = (new Date).getTime();
                    if (d >= a) {
                        var e = Math.round(100 * this.time / this.tstop);
                        this.progress.update(e);
                        var f = this;
                        return void setTimeout(function() {
                            try {
                                f.simulate(d + f.progress.update_interval)
                            } catch (a) {
                                if ("string" != typeof a)
                                    throw a;
                                f.progress.finish(a)
                            }
                        }
                        , 1)
                    }
                }
            }
            this.time = this.tstop
        }
        this.progress.finish(void 0)
    }
    ,
    g.prototype.add_event = function(a, b, c, d) {
        var e = new h(a,b,c,d);
        return this.event_queue.push(e),
        this.debug_level > 2 && console.log("add " + "cp"[b] + " event: " + c.name + "->" + "01XZ"[d] + " @ " + a),
        e
    }
    ,
    g.prototype.remove_event = function(a) {
        this.event_queue.removeItem(a),
        this.debug_level > 2 && console.log("remove " + "cp"[a.type] + " event: " + a.node.name + "->" + "01XZ"[a.v] + " @ " + a.time)
    }
    ,
    g.prototype.history = function(a) {
        a = this.unalias(a);
        var b = this.node_map[a];
        return void 0 === b ? void 0 : (b.times[b.times.length - 1] != this.time && (b.times.push(this.time),
        b.values.push(b.v)),
        {
            xvalues: b.times,
            yvalues: b.values
        })
    }
    ,
    g.prototype.get_memory = function(a) {
        var b = this.device_map[a];
        return void 0 !== b && "memory" == b.type ? b.get_contents() : void 0
    }
    ,
    g.prototype.result_type = function() {
        return "digital"
    }
    ,
    g.prototype.node_list = function() {
        var a = [];
        for (var b in this.node_map)
            a.push(b);
        return a
    }
    ,
    g.prototype.get_timing_info = function() {
        var a = []
          , b = {};
        return $.each(this.node_map, function(c, d) {
            d.clock && a.push(d),
            b[c] = d.get_timing_info()
        }
        ),
        {
            clocks: a,
            timing: b
        }
    }
    ;
    var r = 0
      , s = 1;
    i.prototype.assert = function() {
        var a, b, c = this.nodes.length;
        for (a = 0; c > a; a += 1) {
            if (b = 2 * a + 1,
            c > b && this.nodes[a].time > this.nodes[b].time)
                throw "heap error 1";
            if (c > b + 1 && this.nodes[a].time > this.nodes[b + 1].time)
                throw "heap error 2"
        }
    }
    ,
    i.prototype.cmplt = function(a, b) {
        return a.time < b.time
    }
    ,
    i.prototype._siftdown = function(a, b) {
        var c, d, e;
        for (c = this.nodes[b]; b > a && (e = b - 1 >> 1,
        d = this.nodes[e],
        this.cmplt(c, d)); )
            this.nodes[b] = d,
            b = e;
        this.nodes[b] = c
    }
    ,
    i.prototype._siftup = function(a) {
        var b, c, d, e, f;
        for (c = this.nodes.length,
        f = a,
        d = this.nodes[a],
        b = 2 * a + 1; c > b; )
            e = b + 1,
            c > e && !this.cmplt(this.nodes[b], this.nodes[e]) && (b = e),
            this.nodes[a] = this.nodes[b],
            a = b,
            b = 2 * a + 1;
        this.nodes[a] = d,
        this._siftdown(f, a)
    }
    ,
    i.prototype.push = function(a) {
        this.nodes.push(a),
        this._siftdown(0, this.nodes.length - 1)
    }
    ,
    i.prototype.pop = function() {
        var a, b;
        return a = this.nodes.pop(),
        this.nodes.length ? (b = this.nodes[0],
        this.nodes[0] = a,
        this._siftup(0)) : b = a,
        b
    }
    ,
    i.prototype.peek = function() {
        return this.nodes[0]
    }
    ,
    i.prototype.contains = function(a) {
        return -1 !== this.nodes.indexOf(a)
    }
    ,
    i.prototype.updateItem = function(a) {
        var b = this.nodes.indexOf(a);
        -1 != b && (this._siftdown(0, b),
        this._siftup(b))
    }
    ,
    i.prototype.removeItem = function(a) {
        var b = this.nodes.indexOf(a);
        if (-1 != b) {
            var c = this.nodes.pop();
            a !== c && (this.nodes[b] = c,
            this._siftdown(0, b),
            this._siftup(b))
        }
    }
    ,
    i.prototype.clear = function() {
        return this.nodes = []
    }
    ,
    i.prototype.empty = function() {
        return 0 === this.nodes.length
    }
    ,
    i.prototype.size = function() {
        return this.nodes.length
    }
    ;
    var t = 0
      , u = 1
      , v = 2
      , w = 3
      , x = 0
      , y = 0;
    j.prototype.initialize = function() {
        this.v = v,
        this.times = [0],
        this.values = [v],
        this.cd_event = void 0,
        this.pd_event = void 0,
        this.clock = !1,
        this.timing_info = void 0,
        this.in_progress = !1
    }
    ,
    j.prototype.add_fanout = function(a) {
        -1 == this.fanouts.indexOf(a) && this.fanouts.push(a)
    }
    ,
    j.prototype.add_driver = function(a) {
        this.drivers.push(a)
    }
    ,
    j.prototype.process_event = function(a) {
        a == this.cd_event ? this.cd_event = void 0 : a == this.pd_event ? this.pd_event = void 0 : console.log("unknown event!", this.name, this.network.time),
        this.v != a.v && (this.times.push(a.time),
        this.values.push(a.v)),
        this.network.debug_level > 0 && console.log(this.name + ": " + "01XZ"[this.v] + "->" + "01XZ"[a.v] + " @ " + a.time + [" contamination", " propagation"][a.type]),
        this.v = a.v;
        for (var b = this.fanouts.length - 1; b >= 0; b -= 1)
            this.network.debug_level > 1 && console.log("Evaluating (" + "cp"[a.type] + ") " + this.fanouts[b].name + " @ " + a.time),
            this.fanouts[b].process_event(a, this)
    }
    ,
    j.prototype.last_event_time = function() {
        return this.times[this.times.length - 1]
    }
    ,
    j.prototype.finalize = function() {
        if (void 0 !== this.drivers && void 0 === this.driver) {
            var a = this.drivers.length
              , b = this.fanouts.length;
            if (0 === a) {
                if (!(b > 0))
                    return;
                if (!this.network.options.timing_analysis) {
                    var c = [];
                    throw $.each(this.fanouts, function(a, b) {
                        c.push(b.name)
                    }
                    ),
                    "Node " + this.name + " is not connected to any output<br>but is an input to the following devices:<li>" + c.join("<li>")
                }
            }
            0 === this.capacitance && (this.capacitance = y + x * (a + b));
            var d, e;
            for (d = 0; a > d; d += 1)
                this.capacitance += this.drivers[d].capacitance(this);
            for (d = 0; b > d; d += 1)
                this.capacitance += this.fanouts[d].capacitance(this);
            if (1 >= a)
                return this.driver = this.drivers[0],
                void (this.drivers = void 0);
            var f = [];
            for (d = 0; a > d; d += 1) {
                if (e = this.drivers[d],
                !e.tristate(this)) {
                    for (var g = "Node " + this.name + " is driven by multiple gates.  See devices:<br>", h = 0; a > h; h += 1)
                        g += "<li>" + this.drivers[h].name;
                    throw g
                }
                var i = this.network.node(this.name + "$" + d.toString());
                i.capacitance = this.capacitance,
                f.push(i),
                e.change_output_node(this, i),
                i.driver = e
            }
            this.capacitance = 0,
            this.driver = new l(this.network,"BUS",this.name + "%bus",K,f,this,{},!0),
            this.drivers = void 0
        }
    }
    ,
    j.prototype.c_event = function(a) {
        var b = this.network.time + a;
        if (this.pd_event && this.pd_event.time >= b && (this.network.remove_event(this.pd_event),
        this.pd_event = void 0),
        this.cd_event) {
            if (this.cd_event.time <= b)
                return;
            this.network.remove_event(this.cd_event)
        }
        this.cd_event = this.network.add_event(b, r, this, v)
    }
    ,
    j.prototype.p_event = function(a, b, c, d) {
        var e = this.network.time + a + c * this.capacitance;
        if (this.pd_event) {
            if (d && this.pd_event.v == b && e >= this.pd_event.time)
                return;
            this.network.remove_event(this.pd_event)
        }
        this.pd_event = this.network.add_event(e, s, this, b)
    }
    ,
    j.prototype.is_input = function() {
        return void 0 === this.driver || this.driver instanceof k
    }
    ,
    j.prototype.is_output = function() {
        return 0 === this.fanouts.length && void 0 !== this.driver && !(this.driver instanceof k) && -1 == this.name.indexOf(".")
    }
    ,
    j.prototype.get_timing_info = function() {
        if (void 0 === this.timing_info)
            if (this.is_input())
                this.timing_info = new o(this.name,this);
            else {
                if (this.in_progress)
                    throw "Combinational cycle detected:\n  " + this.name;
                try {
                    this.in_progress = !0,
                    this.timing_info = this.driver.get_timing_info(this),
                    this.in_progress = !1
                } catch (a) {
                    throw this.in_progress = !1,
                    a + "\n  " + this.name
                }
            }
        return this.timing_info
    }
    ,
    k.prototype.change_output_node = function(a, b) {
        this.output == a && (this.output = b)
    }
    ,
    k.prototype.initialize = function() {
        this.initial_value != v && this.output.p_event(0, this.initial_value, 0, !1)
    }
    ,
    k.prototype.capacitance = function() {
        return 0
    }
    ,
    k.prototype.tristate = function() {
        return !1
    }
    ,
    k.prototype.process_event = function(a) {
        var b, c = this.network.time;
        a.type == s && (b = this.next_contamination_time(c),
        b >= 0 && this.output.c_event(b - c),
        b = this.next_propagation_time(c),
        b.time > 0 && this.output.p_event(b.time - c, b.value, 0, !1))
    }
    ,
    k.prototype.next_contamination_time = function(a) {
        a += 1e-13;
        var b = a
          , c = 0;
        0 !== this.period && (b = Math.fmod(b, this.period),
        c = a - b);
        for (var d, e = 0, f = 0, g = this.tvpairs.length, h = 0; g > h; h += 2) {
            var i = this.tvpairs[h]
              , j = this.tvpairs[h + 1];
            if (h > 0 && i >= b)
                if (f >= this.vih && j < this.vih) {
                    if (d = e + (i - e) * (this.vih - f) / (j - f),
                    d > b)
                        return c + d
                } else if (f <= this.vil && j > this.vil && (d = e + (i - e) * (this.vil - f) / (j - f),
                d > b))
                    return c + d;
            e = i,
            f = j
        }
        return -1
    }
    ,
    k.prototype.next_propagation_time = function(a) {
        a += 1e-13;
        var b = a
          , c = 0;
        0 !== this.period && (b = Math.fmod(b, this.period),
        c = a - b);
        for (var d, e = 0, f = 0, g = this.tvpairs.length, h = 0; g > h; h += 2) {
            var i = this.tvpairs[h]
              , j = this.tvpairs[h + 1];
            if (h > 0 && i >= b)
                if (f < this.vih && j >= this.vih) {
                    if (d = e + (i - e) * (this.vih - f) / (j - f),
                    d > b)
                        return {
                            time: c + d,
                            value: u
                        }
                } else if (f > this.vil && j <= this.vil && (d = e + (i - e) * (this.vil - f) / (j - f),
                d > b))
                    return {
                        time: c + d,
                        value: t
                    };
            e = i,
            f = j
        }
        return {
            time: -1
        }
    }
    ,
    k.prototype.get_clock_info = function() {
        return void 0
    }
    ;
    var z = [];
    z.push(z, z, z, z, 0);
    var A = [];
    A.push(A, A, A, A, 1);
    var B = [];
    B.push(B, B, B, B, 2);
    var C = [];
    C.push(C, C, C, C, 3);
    var D = [z, A, B, B, 2]
      , E = [D, D, D, D, 2]
      , F = [E, E, E, E, 2]
      , G = [F, F, F, F, 2]
      , H = [z, B, B, B, 2]
      , I = [B, A, B, B, 2]
      , J = [H, I, B, B, 2]
      , K = []
      , L = []
      , M = [];
    K.push(L, M, B, K, 3),
    L.push(L, B, B, L, 0),
    M.push(B, M, B, M, 1);
    var N = [C, D, B, B, 2]
      , O = [];
    O.push(z, O, O, O, 2);
    var P = [];
    P.push(z, P, O, O, 1);
    var Q = [];
    Q.push(A, Q, Q, Q, 2);
    var R = [];
    R.push(A, R, Q, Q, 0);
    var S = [];
    S.push(S, A, S, S, 2);
    var T = [];
    T.push(T, A, S, S, 0);
    var U = [];
    U.push(U, z, U, U, 2);
    var V = [];
    V.push(V, z, U, U, 1);
    var W = []
      , X = [];
    W.push(W, X, B, B, 0),
    X.push(X, W, B, B, 1);
    var Y = []
      , Z = [];
    Y.push(Y, Z, B, B, 1),
    Z.push(Z, Y, B, B, 0);
    var _ = [D, E, J, J, 2]
      , ab = [D, F, J, J, 2]
      , bb = [E, G, J, J, 2]
      , cb = [ab, bb, J, J, 2]
      , db = {
        and2: [["a", "b"], "z", P],
        and3: [["a", "b", "c"], "z", P],
        and4: [["a", "b", "c", "d"], "z", P],
        buffer: [["a"], "z", P],
        buffer_h: [["a"], "z", P],
        inverter: [["a"], "z", R],
        mux2: [["s", "d0", "d1"], "y", _],
        mux4: [["s[0]", "s[1]", "d0", "d1", "d2", "d3"], "y", cb],
        nand2: [["a", "b"], "z", R],
        nand3: [["a", "b", "c"], "z", R],
        nand4: [["a", "b", "c", "d"], "z", R],
        nor2: [["a", "b"], "z", V],
        nor3: [["a", "b", "c"], "z", V],
        nor4: [["a", "b", "c", "d"], "z", V],
        or2: [["a", "b"], "z", T],
        or3: [["a", "b", "c"], "z", T],
        or4: [["a", "b", "c", "d"], "z", T],
        tristate: [["e", "a"], "z", N],
        xor2: [["a", "b"], "z", W],
        xnor2: [["a", "b"], "z", Y]
    };
    l.prototype.change_output_node = function(a, b) {
        this.output == a && (this.output = b)
    }
    ,
    l.prototype.initialize = function() {
        if (0 === this.inputs.length) {
            var a = this.logic_eval();
            this.output.p_event(0, a, 0, !1)
        }
    }
    ,
    l.prototype.capacitance = function(a) {
        for (var b = 0, c = 0; c < this.inputs.length; c += 1)
            this.inputs[c] == a && (b += this.cin);
        return this.output == a && (b += this.cout),
        b
    }
    ,
    l.prototype.tristate = function(a) {
        return this.output == a && this.table == N ? !0 : !1
    }
    ,
    l.prototype.describe = function(a) {
        for (var b = [], c = 0; c < this.inputs.length; c += 1)
            b.push(this.inputs[c].name + "=" + "01XZ".charAt(this.inputs[c].v));
        var d = "01XZ".charAt(this.logic_eval());
        console.log((a || "") + this.name + ":" + this.type + "(" + b.join(",") + ")=" + d + " @ " + (1e9 * this.network.time).toFixed(3)),
        console.log("    output " + this.output.name + "=" + "01XZ".charAt(this.output.v) + " @ " + (1e9 * this.output.last_event_time()).toFixed(3))
    }
    ,
    l.prototype.process_event = function(a) {
        var b, c = this.output;
        if (a.type == r) {
            if (this.lenient)
                if (b = this.logic_eval(),
                void 0 === c.pd_event) {
                    if (void 0 === c.cd_event && b == c.v)
                        return
                } else if (b == c.pd_event.v)
                    return;
            c.c_event(this.tcd)
        } else if (a.type == s) {
            b = this.logic_eval();
            var d, e;
            b == u ? (e = this.tpdr,
            d = this.tr) : b == t ? (e = this.tpdf,
            d = this.tf) : (e = Math.min(this.tpdr, this.tpdf),
            d = 0),
            c.p_event(e, b, d, this.lenient)
        }
    }
    ,
    l.prototype.get_timing_info = function(a) {
        for (var b = this.tpdr + this.tr * a.capacitance, c = this.tpdf + this.tf * a.capacitance, d = new o(a.name,a,this,this.tcd,Math.max(b, c)), e = 0; e < this.inputs.length; e += 1)
            this.inputs[e].constant_value || d.set_delays(this.inputs[e].get_timing_info());
        return d
    }
    ,
    l.prototype.get_clock_info = function() {
        return void 0
    }
    ,
    m.prototype.change_output_node = function(a, b) {
        this.q == a && (this.q = b)
    }
    ,
    m.prototype.initialize = function() {
        this.min_setup = void 0,
        this.min_setup_time = void 0,
        this.state = v
    }
    ,
    m.prototype.capacitance = function(a) {
        var b = 0;
        return this.q == a && (b += this.cout),
        this.d == a && (b += this.cin),
        this.clk == a && (b += this.cin),
        b
    }
    ,
    m.prototype.tristate = function() {
        return !1
    }
    ,
    m.prototype.process_event = function(a, b) {
        if ("dreg" == this.type) {
            if (a.type != s)
                return;
            if (this.clk.v == t)
                this.state = this.d.v,
                this.edge_possible = !0;
            else if (this.clk == b)
                if (this.clk.v == u) {
                    var c = this.network.time
                      , d = this.d.last_event_time();
                    if (void 0 !== d && this.edge_possible && c > 0) {
                        var e = c - d;
                        (void 0 === this.min_setup || e < this.min_setup) && (this.min_setup = e,
                        this.min_setup_time = c)
                    }
                    this.edge_possible = !1,
                    this.lenient && this.state == this.q.v || this.q.c_event(this.tcd),
                    this.q.p_event(this.state == t ? this.tpdf : this.tpdr, this.state, this.state == t ? this.tf : this.tr, this.lenient)
                } else
                    this.lenient && this.state == this.d.v || (this.state = v),
                    this.lenient && this.state == this.q.v || this.q.p_event(Math.min(this.tpdf, this.tpdr), v, 0, this.lenient)
        } else {
            var f = this.clk.v == this.gate_closed ? this.state : this.clk.v == this.gate_open ? this.d.v : this.lenient && this.d.v == this.state ? this.state : v;
            if (this.clk.v == this.gate_open && (this.state = f),
            a.type == r) {
                if (this.lenient)
                    if (void 0 == this.q.pd_event) {
                        if (void 0 == this.q.cd_event && f == this.q.v)
                            return
                    } else if (f == this.q.pd_event.v)
                        return;
                this.q.c_event(this.tcd)
            } else if (a.type == s && (!this.lenient || f != this.q.v || void 0 !== this.q.cd_event || void 0 !== this.q.pd_event)) {
                var g, h;
                f == u ? (h = this.tpdr,
                g = this.tr) : f == t ? (h = this.tpdf,
                g = this.tf) : (h = Math.min(this.tpdr, this.tpdf),
                g = 0),
                this.q.p_event(h, f, g, this.lenient)
            }
        }
    }
    ,
    m.prototype.get_timing_info = function(a) {
        var b = this.tpdr + this.tr * a.capacitance
          , c = this.tpdf + this.tf * a.capacitance
          , d = new o(a.name,a,this,this.tcd,Math.max(b, c))
          , e = $.extend({}, this.clk.get_timing_info());
        return e.name = e.name + "\u2191",
        d.set_delays(e),
        "dreg" != this.type && d.set_delays(this.d.get_timing_info()),
        d
    }
    ,
    m.prototype.get_clock_info = function(a) {
        if ("dreg" == this.type) {
            var b = new o(a.name + "\u2191",a,this,-this.th,this.ts);
            return b.set_delays(this.d.get_timing_info()),
            b
        }
        return void 0
    }
    ,
    n.prototype.change_output_node = function(a, b) {
        $.each(this.ports, function(c, d) {
            $.each(d.data_out, function(c, e) {
                e == a && (d.data_out[c] = b)
            }
            )
        }
        )
    }
    ,
    n.prototype.get_contents = function() {
        for (var a = [], b = 0; b < this.nlocations; b += 1) {
            for (var c = 0, d = 0; d < this.width; d += 1) {
                var e = this.bits[b * this.width + (this.width - 1 - d)];
                if (e == v) {
                    c = void 0;
                    break
                }
                c *= 2,
                e == u && (c += 1)
            }
            a[b] = c
        }
        return a
    }
    ,
    n.prototype.clear_memory = function() {
        for (var a = this.nlocations * this.width, b = 0; a > b; b += 1)
            this.bits[b] = v
    }
    ,
    n.prototype.initialize = function() {
        if (this.min_setup = void 0,
        this.min_setup_time = void 0,
        this.clear_memory(),
        void 0 !== this.contents && this.contents.length > 0)
            for (var a = 0; a < this.nlocations; a += 1) {
                var b = this.contents[a];
                if (void 0 !== b)
                    for (var c = 0; c < this.width; c += 1,
                    b >>= 1)
                        this.bits[a * this.width + c] = 1 & b
            }
    }
    ,
    n.prototype.update_from_node = function(a) {
        var b = this.network.time;
        if (b > 0) {
            var c = a.last_event_time();
            if (void 0 !== c) {
                var d = b - c;
                (void 0 === this.min_setup || d < this.min_setup) && (this.min_setup = d,
                this.min_setup_time = b)
            }
        }
    }
    ,
    n.prototype.update_min_setup = function(a) {
        this.update_from_node(a.wen);
        var b;
        for (b = 0; b < this.naddr; b += 1)
            this.update_from_node(a.addr[b]);
        for (b = 0; b < this.width; b += 1)
            this.update_from_node(a.data[b])
    }
    ,
    n.prototype.value = function(a) {
        for (var b, c, d = 0, e = 0; e < a.length; e += 1) {
            if (b = a[e],
            c = b.v,
            c == v || c == w)
                return void 0;
            d *= 2,
            c == u && (d += 1)
        }
        return d
    }
    ,
    n.prototype.active_read_port = function(a, b) {
        return a.read_port ? b == a.oe ? !0 : a.oe.v != t && -1 != a.addr.indexOf(b) ? !0 : !1 : !1
    }
    ,
    n.prototype.update_read_port = function(a) {
        for (var b = this.value(a.addr), c = N[a.oe.v], d = 0; d < this.width; d += 1) {
            var e = this.width - 1 - d
              , f = void 0 === b || b >= this.nlocations ? v : this.bits[b * this.width + e];
            f = c[f][4];
            var g, h;
            f == u ? (h = this.tpdr,
            g = this.tr) : f == t ? (h = this.tpdf,
            g = this.tf) : f == w ? (h = 0,
            g = 0) : (h = Math.min(this.tpdr, this.tpdf),
            g = 0),
            a.data_out[d].p_event(h, f, g, this.lenient)
        }
    }
    ,
    n.prototype.location_changed = function(a) {
        for (var b = 0; b < this.ports.length; b += 1) {
            var c = this.ports[b];
            if (c.read_port && c.oe.v != t) {
                var d = this.value(c.addr);
                (void 0 === a || 0 > d || d == a) && this.update_read_port(c)
            }
        }
    }
    ,
    n.prototype.active_write_port = function(a, b) {
        if (!a.write_port)
            return !1;
        if (b == a.clk)
            if (a.clk.v == t)
                a.edge_possible = !0;
            else if (a.clk.v == u && a.edge_possible && (a.edge_possible = !1,
            a.wen.v != t))
                return !0;
        return !1
    }
    ,
    n.prototype.capacitance = function(a) {
        var b = this
          , c = 0;
        return $.each(b.ports, function(d, e) {
            e.clk == a && (c += b.cin),
            e.wen == a && (c += b.cin),
            e.oe == a && (c += b.cin),
            $.each(e.addr, function(d, e) {
                e == a && (c += b.cin)
            }
            ),
            $.each(e.data, function(d, f) {
                f == a && ((e.clk != b.network.gnd || e.wen != b.network.gnd) && (c += b.cin),
                e.oe != b.network.gnd && (c += b.cout))
            }
            )
        }
        ),
        c
    }
    ,
    n.prototype.tristate = function(a) {
        return -1 != this.tristate_outputs.indexOf(a)
    }
    ,
    n.prototype.process_event = function(a, b) {
        var c, d, e;
        if (a.type == r) {
            for (c = 0; c < this.ports.length; c += 1)
                if (e = this.ports[c],
                this.active_read_port(e, b))
                    for (d = 0; d < this.width; d += 1)
                        e.data[d].c_event(this.tcd)
        } else if (a.type == s)
            for (c = 0; c < this.ports.length; c += 1)
                if (e = this.ports[c],
                this.active_read_port(e, b) && this.update_read_port(e),
                this.active_write_port(e, b)) {
                    var f = this.value(e.addr);
                    if (void 0 === f)
                        this.clear_memory();
                    else if (f < this.nlocations)
                        for (d = 0; d < this.width; d += 1) {
                            var g = e.wen.v == u ? e.data[d].v : v;
                            this.bits[f * this.width + (this.width - 1) - d] = g
                        }
                    this.location_changed(f),
                    this.update_min_setup(e)
                }
    }
    ,
    n.prototype.get_timing_info = function(a) {
        for (var b = this.tpdr + this.tr * a.capacitance, c = this.tpdf + this.tf * a.capacitance, d = new o(a.name,a,this,this.tcd,Math.max(b, c)), e = 0; e < this.ports.length; e += 1) {
            var f = this.ports[e];
            if (f.read_port && -1 != f.data_out.indexOf(a)) {
                d.set_delays(f.oe.get_timing_info());
                for (var g = 0; g < this.naddr; g += 1)
                    d.set_delays(f.addr[g].get_timing_info())
            }
        }
        return d
    }
    ,
    n.prototype.get_clock_info = function(a) {
        var b, c, d, e;
        for (c = 0; c < this.ports.length; c += 1)
            if (e = this.ports[c],
            e.write_port && e.clk == a) {
                for (void 0 === b && (b = new o(a.name + "\u2191",a,this,-this.th,this.ts)),
                b.set_delays(e.wen.get_timing_info()),
                d = 0; d < this.naddr; d += 1)
                    b.set_delays(e.addr[d].get_timing_info());
                for (d = 0; d < this.width; d += 1)
                    b.set_delays(e.data[d].get_timing_info())
            }
        return b
    }
    ,
    o.prototype.get_tcd_source = function() {
        for (var a = this; void 0 !== a.cd_link; )
            a = a.cd_link;
        return {
            node: a.node,
            name: a.name
        }
    }
    ,
    o.prototype.get_tpd_source = function() {
        for (var a = this; void 0 !== a.pd_link; )
            a = a.pd_link;
        return {
            node: a.node,
            name: a.name
        }
    }
    ,
    o.prototype.set_delays = function(a) {
        var b;
        b = a.cd_sum + this.tcd,
        (void 0 === this.cd_link || b < this.cd_sum) && (this.cd_link = a,
        this.cd_sum = b),
        b = a.pd_sum + this.tpd,
        (void 0 === this.pd_link || b > this.pd_sum) && (this.pd_link = a,
        this.pd_sum = b)
    }
    ,
    o.prototype.describe_tpd = function() {
        var a;
        a = void 0 !== this.pd_link ? this.pd_link.describe_tpd() : "";
        var b = void 0 !== this.device ? " [" + this.device.name + " " + this.device.type + "]" : "";
        return a += "    + " + p(1e9 * this.tpd, 6, 3) + "ns = " + p(1e9 * this.pd_sum, 6, 3) + "ns " + this.name + b + "\n"
    }
    ,
    o.prototype.describe_tcd = function() {
        var a;
        a = void 0 !== this.cd_link ? this.cd_link.describe_tcd() : "";
        var b = void 0 !== this.device ? " [" + this.device.name + "]" : "";
        return a += "    " + (this.tcd < 0 ? "-" : "+"),
        a += " " + p(1e9 * Math.abs(this.tcd), 6, 3) + "ns = " + p(1e9 * this.cd_sum, 6, 3) + "ns " + this.name + b + "\n"
    }
    ;
    var eb = {
        dc_analysis: c,
        ac_analysis: d,
        transient_analysis: e,
        timing_analysis: f,
        get_last_network: b
    };
    return eb
}
,
jade_defs.services = function(a) {
    a.load_from_server = function(a, b, c) {
        if (b) {
            var d = {
                async: !1,
                url: "https://6004.mit.edu/coursewarex/" + a,
                type: "POST",
                dataType: "json",
                error: function(b, c, d) {
                    alert("Error while loading file " + a + ": " + d)
                },
                success: function(a) {
                    c && c(a)
                }
            };
            $.ajax(d)
        } else
            alert("Sandbox can only load shared modules.")
    }
    ,
    a.save_to_server = function() {}
    ,
    a.unsaved_changes = function() {}
    ,
    a.request_zip_url = void 0,
    a.setup = function(b) {
        if (void 0 === b.jade) {
            $(b).hasClass("jade-save-state") && (a.unsaved_changes = function(a) {
                a && void 0 === $("body").attr("data-dirty") ? $("body").attr("data-dirty", "true") : a || void 0 === $("body").attr("data-dirty") || $("body").removeAttr("data-dirty")
            }
            );
            var c = {}
              , d = $(b).text().trim();
            if ($(b).empty(),
            d)
                try {
                    c = JSON.parse(d)
                } catch (e) {
                    console.log("Error parsing configuration: " + e)
                }
            var f = new a.Jade(b);
            f.initialize(c)
        }
    }
}
,
$(document).ready(function() {
    $(".jade").each(function(a, b) {
        var c = new jade_defs.jade;
        jade_defs.services(c),
        c.setup(b)
    }
    )
}
),
$(window).bind("beforeunload", function() {
    return void 0 !== $("body").attr("data-dirty") ? "You have unsaved changes on this page." : void 0
}
),
jade_defs.analog = function(a) {
    a.model.load_json({
        "/analog/v_probe": {
            properties: {
                color: {
                    edit: "yes",
                    label: "Plot color",
                    type: "menu",
                    value: "red",
                    choices: ["red", "green", "blue", "cyan", "magenta", "yellow", "black", "x-axis"]
                },
                tool_tip: {
                    edit: "no",
                    type: "string",
                    value: "Voltage probe",
                    label: "Tool tip"
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                offset: {
                    edit: "yes",
                    type: "number",
                    value: "0",
                    label: "Plot offset"
                }
            },
            icon: [["terminal", [0, 0, 0], {
                line: "no",
                name: "probe"
            }], ["line", [0, 0, 0, 4, -4]], ["line", [2, -6, 0, 4, 4]], ["line", [2, -6, 0, 15, -15]], ["line", [6, -2, 0, 15, -15]], ["line", [17, -21, 0, 4, 4]], ["arc", [19, -19, 0, 11, -2, 5, -3]]]
        },
        "/analog/i_probe": {
            properties: {
                color: {
                    edit: "yes",
                    label: "Plot color",
                    type: "menu",
                    value: "red",
                    choices: ["red", "green", "blue", "cyan", "magenta", "yellow", "black"]
                },
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "Current probe",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                offset: {
                    edit: "yes",
                    label: "Offset",
                    type: "number",
                    value: "0",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "nplus"
            }], ["terminal", [16, 0, 4], {
                name: "nminus"
            }], ["line", [10, 0, 0, -4, -4]], ["line", [10, 0, 6, -4, -4]]]
        },
        "/analog/inductor": {
            properties: {
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "Inductor",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                l: {
                    edit: "yes",
                    label: "Inductance (H)",
                    type: "number",
                    value: "1",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 7], {
                name: "n1"
            }], ["terminal", [0, 48, 3], {
                name: "n2"
            }], ["line", [0, 14, 0, 0, -6]], ["line", [0, 34, 0, 0, 6]], ["arc", [-3, 28, 0, 3, 6, 3, -2]], ["arc", [0, 14, 0, -3, 6, 0, 8]], ["property", [8, 24, 0], {
                format: "{l}H"
            }], ["property", [-6, 24, 0], {
                align: "center-right",
                format: "{name}"
            }], ["arc", [-3, 20, 0, 0, 8, 7, 2]]]
        },
        "/analog/pfet": {
            properties: {
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "P-Channel mosfet",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                L: {
                    edit: "yes",
                    label: "Scaled length",
                    type: "number",
                    value: "1",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                W: {
                    edit: "yes",
                    label: "Scaled width",
                    type: "number",
                    value: "2",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "D"
            }], ["terminal", [0, 32, 3], {
                name: "S"
            }], ["terminal", [-24, 16, 0], {
                name: "G"
            }], ["line", [0, 8, 0, -8, 0]], ["line", [-8, 8, 0, 0, 16]], ["line", [-8, 24, 0, 8, 0]], ["line", [-11, 8, 0, 0, 16]], ["property", [0, 16, 0], {
                format: "{W}/{L}"
            }], ["circle", [-14, 16, 0, 2]]]
        },
        "/analog/resistor": {
            properties: {
                tool_tip: {
                    edit: "no",
                    type: "string",
                    value: "Resistor",
                    label: "Tool tip"
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                r: {
                    edit: "yes",
                    type: "number",
                    value: "1",
                    label: "Resistance (\u03a9)"
                },
                name: {
                    edit: "yes",
                    type: "name",
                    value: "",
                    label: "Name"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "n1"
            }], ["terminal", [0, 48, 3], {
                name: "n2"
            }], ["line", [0, 8, 0, 0, 4]], ["line", [0, 12, 0, 4, 2]], ["line", [4, 14, 0, -8, 4]], ["line", [-4, 18, 0, 8, 4]], ["line", [4, 22, 0, -8, 4]], ["line", [-4, 26, 0, 8, 4]], ["line", [4, 30, 0, -8, 4]], ["line", [-4, 34, 0, 4, 2]], ["line", [0, 36, 0, 0, 4]], ["property", [5, 24, 0], {
                format: "{r}\u03a9"
            }], ["property", [-5, 24, 0], {
                align: "center-right",
                format: "{name}"
            }]]
        },
        "/analog/v_source": {
            properties: {
                tool_tip: {
                    edit: "no",
                    type: "string",
                    value: "Voltage source",
                    label: "Tool tip"
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                name: {
                    edit: "yes",
                    type: "name",
                    value: "",
                    label: "Name"
                },
                value: {
                    edit: "yes",
                    type: "string",
                    value: "dc(1)",
                    label: "Value"
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "nplus"
            }], ["terminal", [0, 48, 3], {
                name: "nminus"
            }], ["line", [0, 8, 0, 0, 4]], ["circle", [0, 24, 0, 12, 0]], ["line", [0, 36, 0, 0, 4]], ["line", [0, 15, 0, 0, 6]], ["line", [-3, 18, 0, 6, 0]], ["line", [-3, 30, 0, 6, 0]], ["property", [14, 24, 0], {
                format: "{value}"
            }], ["property", [-14, 24, 0], {
                align: "center-right",
                format: "{name}"
            }]]
        },
        "/analog/nfet": {
            properties: {
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "N-Channel mosfet",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                L: {
                    edit: "yes",
                    label: "Scaled length",
                    type: "number",
                    value: "1",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                W: {
                    edit: "yes",
                    label: "Scaled width",
                    type: "number",
                    value: "2",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "D"
            }], ["terminal", [0, 32, 3], {
                name: "S"
            }], ["terminal", [-24, 16, 0], {
                name: "G"
            }], ["line", [0, 8, 0, -8, 0]], ["line", [-8, 8, 0, 0, 16]], ["line", [-8, 24, 0, 8, 0]], ["line", [-11, 8, 0, 0, 16]], ["property", [0, 16, 0], {
                format: "{W}/{L}"
            }], ["line", [-16, 16, 0, 5, 0]]]
        },
        "/analog/diode": {
            properties: {
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "Diode",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                area: {
                    edit: "yes",
                    label: "Area",
                    type: "number",
                    value: "1",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                type: {
                    edit: "yes",
                    label: "Type",
                    type: "menu",
                    value: "normal",
                    choices: ["normal", "ideal"]
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "anode"
            }], ["terminal", [0, 48, 5], {
                name: "cathode"
            }], ["line", [0, 8, 1, 8, 0]], ["line", [-8, 16, 0, 16, 0]], ["line", [8, 16, 0, -8, 16]], ["line", [0, 32, 0, -8, -16]], ["line", [-8, 32, 0, 16, 0]], ["line", [0, 40, 0, 0, -8]], ["property", [8, 24, 0], {
                format: "{area}"
            }], ["property", [-8, 24, 0], {
                align: "center-right",
                format: "{name}"
            }]]
        },
        "/analog/opamp": {
            properties: {
                A: {
                    edit: "yes",
                    label: "Gain",
                    type: "number",
                    value: "30000",
                    choices: [""]
                },
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "Op Amp",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "nplus"
            }], ["terminal", [0, 16, 0], {
                name: "nminus"
            }], ["terminal", [48, 8, 4], {
                name: "output"
            }], ["terminal", [24, 24, 3], {
                name: "gnd"
            }], ["line", [8, -8, 0, 0, 32]], ["line", [8, 24, 0, 32, -16]], ["line", [40, 8, 0, -32, -16]], ["line", [10, 0, 0, 6, 0]], ["line", [13, -3, 0, 0, 6]], ["line", [10, 16, 0, 6, 0]], ["text", [27, 16, 0], {
                text: "gnd",
                align: "top-left",
                font: "5pt sans-serif"
            }], ["property", [27, 0, 0], {
                align: "bottom-left",
                format: "{name}"
            }]]
        },
        "/analog/capacitor": {
            properties: {
                tool_tip: {
                    edit: "no",
                    type: "string",
                    value: "Capacitor",
                    label: "Tool tip"
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                c: {
                    edit: "yes",
                    type: "number",
                    value: "1",
                    label: "Capacitance (F)"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                name: {
                    edit: "yes",
                    type: "name",
                    value: "",
                    label: "Name"
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "n1"
            }], ["terminal", [0, 48, 3], {
                name: "n2"
            }], ["line", [0, 8, 0, 0, 14]], ["line", [-8, 22, 0, 16, 0]], ["line", [-8, 26, 0, 16, 0]], ["line", [0, 26, 0, 0, 14]], ["property", [9, 24, 0], {
                format: "{c}F"
            }], ["property", [-9, 24, 0], {
                align: "center-right",
                format: "{name}"
            }]]
        },
        "/analog/i_source": {
            properties: {
                tool_tip: {
                    edit: "no",
                    label: "Tool tip",
                    type: "string",
                    value: "Current source",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                value: {
                    edit: "yes",
                    label: "Value",
                    type: "string",
                    value: "dc(1)",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 1], {
                name: "nplus"
            }], ["terminal", [0, 48, 3], {
                name: "nminus"
            }], ["line", [0, 8, 0, 0, 4]], ["circle", [0, 24, 0, 12, 0]], ["line", [0, 36, 0, 0, 4]], ["property", [14, 24, 0], {
                format: "{value}"
            }], ["property", [-14, 24, 0], {
                align: "center-right",
                format: "{name}"
            }], ["line", [0, 16, 0, 0, 16]], ["line", [0, 32, 0, 3, -6]], ["line", [0, 32, 0, -3, -6]]]
        },
        "/analog/initial_voltage": {
            properties: {
                tool_tip: {
                    edit: "yes",
                    label: "Tool tip",
                    type: "string",
                    value: "Initial voltage",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                IV: {
                    edit: "yes",
                    label: "Initial voltage",
                    type: "number",
                    value: "0",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 3], {
                name: "node"
            }], ["property", [0, -16, 0], {
                align: "center",
                format: "IV={IV}"
            }], ["line", [-16, -8, 0, 32, 0]], ["line", [16, -8, 0, 0, -16]], ["line", [16, -24, 0, -32, 0]], ["line", [-16, -24, 0, 0, 16]], ["property", [0, -26, 0], {
                align: "bottom-center",
                format: "{name}"
            }]]
        }
    }, !0)
}
,
jade_defs.gates = function(a) {
    a.model.load_json({
        "/gates/xnor2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "140p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.006p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "27",
                    choices: [""]
                }
            },
            icon: [["line", [8, 20, 0, 8, 0]], ["line", [8, -4, 0, 8, 0]], ["arc", [16, -4, 0, 20, 12, 18, 9]], ["arc", [16, 20, 6, 20, 12, 18, 9]], ["arc", [8, -4, 0, 0, 24, 3, 12]], ["property", [32, 14, 0], {
                align: "top-left",
                format: "{name}"
            }], ["arc", [5, -4, 0, 0, 24, 3, 12]], ["terminal", [0, 0, 0], {
                line: "no",
                name: "A"
            }], ["terminal", [0, 16, 0], {
                line: "no",
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [0, 0, 0, 7, 0]], ["line", [0, 16, 0, 7, 0]], ["circle", [38, 8, 0, 2]]]
        },
        "/gates/dreg": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "190p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4300",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                ts: {
                    edit: "no",
                    label: "Setup time (s)",
                    type: "number",
                    value: "200p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                th: {
                    edit: "no",
                    label: "Hold time (s)",
                    type: "number",
                    value: "25p",
                    choices: [""]
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "56",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "D"
            }], ["terminal", [0, 16, 0], {
                name: "CLK"
            }], ["terminal", [40, 0, 4], {
                name: "Q"
            }], ["text", [10, 0, 0], {
                text: "D",
                font: "4pt sans-serif"
            }], ["text", [30, 0, 0], {
                text: "Q",
                align: "center-right",
                font: "4pt sans-serif"
            }], ["line", [8, -8, 0, 24, 0]], ["line", [32, -8, 0, 0, 32]], ["line", [32, 24, 0, -24, 0]], ["line", [8, 24, 0, 0, -32]], ["line", [14, 16, 0, -6, 3]], ["line", [14, 16, 6, -6, 3]], ["property", [20, -8, 0], {
                align: "bottom-center",
                format: "{name}"
            }]]
        },
        "/gates/nor2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "50p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "6700",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.004p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2400",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "10p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "10",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [8, 20, 0, 8, 0]], ["line", [8, -4, 0, 8, 0]], ["arc", [16, -4, 0, 20, 12, 18, 9]], ["arc", [16, 20, 6, 20, 12, 18, 9]], ["circle", [38, 8, 0, 2.23606797749979]], ["arc", [8, -4, 0, 0, 24, 3, 12]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 2, 0]], ["property", [32, 14, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/nor3": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "80p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "8500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: ".005p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2400",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "20p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "13",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 16, 4], {
                name: "Z"
            }], ["line", [8, 28, 0, 8, 0]], ["line", [8, 4, 0, 8, 0]], ["arc", [16, 4, 0, 20, 12, 18, 9]], ["arc", [16, 28, 6, 20, 12, 18, 9]], ["circle", [38, 16, 0, 2.23606797749979]], ["arc", [8, 4, 0, 0, 24, 3, 12]], ["property", [32, 22, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["arc", [8, -4, 0, 0, 8, 2, 4]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 3, 0]], ["line", [8, 32, 0, 2, 0]], ["arc", [8, 28, 0, 0, 8, 2, 5]]]
        },
        "/gates/nor4": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "120p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "9500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.005p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2400",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "20p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "20",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 24, 4], {
                name: "Z"
            }], ["line", [8, 36, 0, 8, 0]], ["line", [8, 12, 0, 8, 0]], ["arc", [16, 12, 0, 20, 12, 18, 9]], ["arc", [16, 36, 6, 20, 12, 18, 9]], ["circle", [38, 24, 0, 2.23606797749979]], ["arc", [8, 12, 0, 0, 24, 3, 12]], ["property", [32, 30, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["terminal", [0, 48, 0], {
                name: "D"
            }], ["arc", [8, 36, 0, 0, 17, 2, 12]], ["arc", [8, 12, 6, 0, 17, 2, 12]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 2, 0]], ["line", [8, 32, 0, 2, 0]], ["line", [8, 48, 0, 2, 0]]]
        },
        "/gates/or3": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "210p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.003p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "40p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "17",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 16, 4], {
                name: "Z"
            }], ["line", [8, 28, 0, 8, 0]], ["line", [8, 4, 0, 8, 0]], ["arc", [16, 4, 0, 20, 12, 18, 9]], ["arc", [16, 28, 6, 20, 12, 18, 9]], ["arc", [8, 4, 0, 0, 24, 3, 12]], ["property", [32, 22, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["arc", [8, -4, 0, 0, 8, 2, 4]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 3, 0]], ["line", [8, 32, 0, 2, 0]], ["arc", [8, 28, 0, 0, 8, 2, 5]], ["line", [40, 16, 0, -4, 0]]]
        },
        "/gates/or2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "150p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "name",
                    type: "string",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "13",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [8, 20, 0, 8, 0]], ["line", [8, -4, 0, 8, 0]], ["arc", [16, -4, 0, 20, 12, 18, 9]], ["arc", [16, 20, 6, 20, 12, 18, 9]], ["arc", [8, -4, 0, 0, 24, 3, 12]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 2, 0]], ["property", [32, 14, 0], {
                align: "top-left",
                format: "{name}"
            }], ["line", [40, 8, 0, -4, 0]]]
        },
        "/gates/or4": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "290p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: ".003p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2600",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "60p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "20",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 24, 4], {
                name: "Z"
            }], ["line", [8, 36, 0, 8, 0]], ["line", [8, 12, 0, 8, 0]], ["arc", [16, 12, 0, 20, 12, 18, 9]], ["arc", [16, 36, 6, 20, 12, 18, 9]], ["arc", [8, 12, 0, 0, 24, 3, 12]], ["property", [32, 30, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["terminal", [0, 48, 0], {
                name: "D"
            }], ["arc", [8, 36, 0, 0, 17, 2, 12]], ["arc", [8, 12, 6, 0, 17, 2, 12]], ["line", [8, 0, 0, 2, 0]], ["line", [8, 16, 0, 2, 0]], ["line", [8, 32, 0, 2, 0]], ["line", [8, 48, 0, 2, 0]], ["line", [40, 24, 0, -4, 0]]]
        },
        "/gates/tristate": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "150p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "2300",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: ".004p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "1300",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "23",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [32, 0, 4], {
                name: "Z"
            }], ["line", [8, -8, 0, 0, 16]], ["line", [8, 8, 0, 16, -8]], ["line", [24, 0, 0, -16, -8]], ["property", [19, -3, 0], {
                align: "bottom-left",
                format: "{name}"
            }], ["text", [17, 8, 0], {
                text: "e",
                align: "center-left",
                font: "6pt sans-serif"
            }], ["terminal", [16, 16, 3], {
                name: "E"
            }], ["line", [16, 8, 0, 0, -4]]]
        },
        "/gates/mux4": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "190p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.006p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "40p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "66",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                line: "no",
                name: "D3"
            }], ["terminal", [0, 16, 0], {
                line: "no",
                name: "D2"
            }], ["terminal", [8, 64, 5], {
                name: "S[1:0]"
            }], ["terminal", [16, 24, 4], {
                line: "no",
                name: "Y"
            }], ["text", [5, 0, 0], {
                text: "3",
                font: "4pt sans-serif"
            }], ["text", [5, 16, 0], {
                text: "2",
                font: "4pt sans-serif"
            }], ["terminal", [0, 32, 0], {
                line: "no",
                name: "D1"
            }], ["terminal", [0, 48, 0], {
                line: "no",
                name: "D0"
            }], ["line", [4, -8, 0, 0, 64]], ["text", [5, 32, 0], {
                text: "1",
                font: "4pt sans-serif"
            }], ["text", [5, 48, 0], {
                text: "0",
                font: "4pt sans-serif"
            }], ["line", [0, 0, 0, 4, 0]], ["line", [0, 16, 0, 4, 0]], ["line", [0, 32, 0, 4, 0]], ["line", [0, 48, 0, 4, 0]], ["line", [16, 24, 0, -4, 0]], ["line", [4, -8, 0, 8, 8]], ["line", [4, 56, 0, 8, -8]], ["line", [12, 0, 0, 0, 48]], ["line", [8, 56, 0, 0, -4]], ["property", [12, 52, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/inverter": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "20p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "2300",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.007p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "1200",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "5p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "10",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [32, 0, 4], {
                line: "no",
                name: "Z"
            }], ["line", [8, -8, 0, 0, 16]], ["line", [8, 8, 0, 16, -8]], ["line", [24, 0, 0, -16, -8]], ["property", [16, 4, 0], {
                align: "top-left",
                format: "{name}"
            }], ["circle", [26, 0, 0, 2]], ["line", [32, 0, 0, -4, 0]]]
        },
        "/gates/mux2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "120p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.005p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "20p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "27",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                line: "no",
                name: "D1"
            }], ["terminal", [0, 16, 0], {
                line: "no",
                name: "D0"
            }], ["terminal", [8, 32, 5], {
                name: "S"
            }], ["line", [4, -8, 0, 0, 32]], ["line", [12, 0, 0, 0, 16]], ["terminal", [16, 8, 4], {
                line: "no",
                name: "Y"
            }], ["text", [5, 0, 0], {
                text: "1",
                font: "4pt sans-serif"
            }], ["text", [5, 16, 0], {
                text: "0",
                font: "4pt sans-serif"
            }], ["line", [4, -8, 0, 8, 8]], ["line", [0, 16, 0, 4, 0]], ["line", [0, 0, 0, 4, 0]], ["line", [12, 8, 0, 4, 0]], ["line", [4, 24, 0, 8, -8]], ["line", [8, 24, 0, 0, -4]], ["property", [12, 20, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/buffer": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "80p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "2200",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.003p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "1200",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "20p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "13",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [32, 0, 4], {
                name: "Z"
            }], ["line", [8, -8, 0, 0, 16]], ["line", [8, 8, 0, 16, -8]], ["line", [24, 0, 0, -16, -8]], ["property", [16, 4, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/nand3": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "50p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4200",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.005p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "3000",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "10p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "13",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 16, 4], {
                name: "Z"
            }], ["arc", [20, 4, 0, 16, 12, 15, 9]], ["arc", [20, 28, 6, 16, 12, 15, 9]], ["line", [8, 4, 0, 12, 0]], ["line", [8, 28, 0, 12, 0]], ["circle", [38, 16, 0, 2]], ["property", [33, 23, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["line", [8, -4, 0, 0, 40]]]
        },
        "/gates/nand2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.004p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2800",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "10p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "10",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [8, -4, 0, 0, 24]], ["arc", [20, -4, 0, 16, 12, 15, 9]], ["arc", [20, 20, 6, 16, 12, 15, 9]], ["line", [8, -4, 0, 12, 0]], ["line", [8, 20, 0, 12, 0]], ["circle", [38, 8, 0, 2]], ["property", [33, 15, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/dlatchn": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "190p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4300",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                ts: {
                    edit: "no",
                    label: "Setup time (s)",
                    type: "number",
                    value: "200p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                th: {
                    edit: "no",
                    label: "Hold time (s)",
                    type: "number",
                    value: "25p",
                    choices: [""]
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "36",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "D"
            }], ["terminal", [0, 16, 0], {
                line: "no",
                name: "GN"
            }], ["terminal", [40, 0, 4], {
                name: "Q"
            }], ["text", [10, 0, 0], {
                text: "D",
                font: "4pt sans-serif"
            }], ["text", [10, 16, 0], {
                text: "GN",
                font: "4pt sans-serif"
            }], ["text", [30, 0, 0], {
                text: "Q",
                align: "center-right",
                font: "4pt sans-serif"
            }], ["line", [8, -8, 0, 24, 0]], ["line", [32, -8, 0, 0, 32]], ["line", [32, 24, 0, -24, 0]], ["line", [8, 24, 0, 0, -32]], ["circle", [6, 16, 0, 2]], ["line", [4, 16, 0, -4, 0]], ["property", [20, -8, 0], {
                align: "bottom-center",
                format: "{name}"
            }]]
        },
        "/gates/and2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "120p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2300",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "13",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [8, -4, 0, 0, 24]], ["arc", [20, -4, 0, 16, 12, 15, 9]], ["arc", [20, 20, 6, 16, 12, 15, 9]], ["line", [8, -4, 0, 12, 0]], ["line", [8, 20, 0, 12, 0]], ["property", [33, 15, 0], {
                align: "top-left",
                format: "{name}"
            }], ["line", [40, 8, 0, -4, 0]]]
        },
        "/gates/and3": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "150p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2600",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "17",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 16, 4], {
                name: "Z"
            }], ["arc", [20, 4, 0, 16, 12, 15, 9]], ["arc", [20, 28, 6, 16, 12, 15, 9]], ["line", [8, 4, 0, 12, 0]], ["line", [8, 28, 0, 12, 0]], ["property", [33, 23, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["line", [8, -4, 0, 0, 40]], ["line", [40, 16, 0, -4, 0]]]
        },
        "/gates/nand4": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "70p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4400",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.005p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "3500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "10p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "17",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 24, 4], {
                name: "Z"
            }], ["arc", [20, 12, 0, 16, 12, 15, 9]], ["arc", [20, 36, 6, 16, 12, 15, 9]], ["line", [8, 12, 0, 12, 0]], ["line", [8, 36, 0, 12, 0]], ["circle", [38, 24, 0, 2]], ["property", [33, 31, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["terminal", [0, 48, 0], {
                name: "D"
            }], ["line", [8, -4, 0, 0, 57]]]
        },
        "/gates/xor2": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "140p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.006p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "27",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                line: "no",
                name: "A"
            }], ["terminal", [0, 16, 0], {
                line: "no",
                name: "B"
            }], ["terminal", [48, 8, 4], {
                name: "Z"
            }], ["line", [8, 20, 0, 8, 0]], ["line", [8, -4, 0, 8, 0]], ["arc", [16, -4, 0, 20, 12, 18, 9]], ["arc", [16, 20, 6, 20, 12, 18, 9]], ["arc", [8, -4, 0, 0, 24, 3, 12]], ["property", [32, 14, 0], {
                align: "top-left",
                format: "{name}"
            }], ["arc", [5, -4, 0, 0, 24, 3, 12]], ["line", [0, 0, 0, 7, 0]], ["line", [0, 16, 0, 7, 0]], ["line", [40, 8, 0, -4, 0]]]
        },
        "/gates/dlatch": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "190p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4300",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                ts: {
                    edit: "no",
                    label: "Setup time (s)",
                    type: "number",
                    value: "200p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                th: {
                    edit: "no",
                    label: "Hold time (s)",
                    type: "number",
                    value: "25p",
                    choices: [""]
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2500",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "36",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "D"
            }], ["terminal", [0, 16, 0], {
                name: "G"
            }], ["terminal", [40, 0, 4], {
                name: "Q"
            }], ["text", [10, 0, 0], {
                text: "D",
                font: "4pt sans-serif"
            }], ["text", [10, 16, 0], {
                text: "G",
                font: "4pt sans-serif"
            }], ["text", [30, 0, 0], {
                text: "Q",
                align: "center-right",
                font: "4pt sans-serif"
            }], ["line", [8, -8, 0, 24, 0]], ["line", [32, -8, 0, 0, 32]], ["line", [32, 24, 0, -24, 0]], ["line", [8, 24, 0, 0, -32]], ["property", [20, -8, 0], {
                align: "bottom-center",
                format: "{name}"
            }]]
        },
        "/gates/buffer_h": {
            properties: {
                tpd: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "70p",
                    label: "Propagation delay (s)"
                },
                name: {
                    edit: "yes",
                    choices: [""],
                    type: "name",
                    value: "",
                    label: "Name"
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "1100",
                    label: "Output rise time (s/F)"
                },
                cin: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "0.005p",
                    label: "Input capacitance (F)"
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "600",
                    label: "Output fall time (s/F)"
                },
                tcd: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "20p",
                    label: "Contamination delay (s)"
                },
                size: {
                    edit: "no",
                    choices: [""],
                    type: "number",
                    value: "17",
                    label: "Size (\u03bc\xb2)"
                }
            },
            icon: [["text", [13, 0, 0], {
                text: "H",
                align: "center",
                font: "bold 6pt sans-serif"
            }], ["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [32, 0, 4], {
                name: "Z"
            }], ["line", [8, -8, 0, 0, 16]], ["line", [8, 8, 0, 16, -8]], ["line", [24, 0, 0, -16, -8]], ["property", [16, 4, 0], {
                align: "top-left",
                format: "{name}"
            }]]
        },
        "/gates/and4": {
            properties: {
                tpd: {
                    edit: "no",
                    label: "Propagation delay (s)",
                    type: "number",
                    value: "160p",
                    choices: [""]
                },
                name: {
                    edit: "yes",
                    label: "Name",
                    type: "name",
                    value: "",
                    choices: [""]
                },
                confidential: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Confidential?"
                },
                tr: {
                    edit: "no",
                    label: "Output rise time (s/F)",
                    type: "number",
                    value: "4500",
                    choices: [""]
                },
                cin: {
                    edit: "no",
                    label: "Input capacitance (F)",
                    type: "number",
                    value: "0.002p",
                    choices: [""]
                },
                readonly: {
                    edit: "no",
                    type: "string",
                    value: "true",
                    label: "Read only?"
                },
                tf: {
                    edit: "no",
                    label: "Output fall time (s/F)",
                    type: "number",
                    value: "2800",
                    choices: [""]
                },
                tcd: {
                    edit: "no",
                    label: "Contamination delay (s)",
                    type: "number",
                    value: "30p",
                    choices: [""]
                },
                size: {
                    edit: "no",
                    label: "Size (\u03bc\xb2)",
                    type: "number",
                    value: "20",
                    choices: [""]
                }
            },
            icon: [["terminal", [0, 0, 0], {
                name: "A"
            }], ["terminal", [0, 16, 0], {
                name: "B"
            }], ["terminal", [48, 24, 4], {
                name: "Z"
            }], ["arc", [20, 12, 0, 16, 12, 15, 9]], ["arc", [20, 36, 6, 16, 12, 15, 9]], ["line", [8, 12, 0, 12, 0]], ["line", [8, 36, 0, 12, 0]], ["property", [33, 31, 0], {
                align: "top-left",
                format: "{name}"
            }], ["terminal", [0, 32, 0], {
                name: "C"
            }], ["terminal", [0, 48, 0], {
                name: "D"
            }], ["line", [8, -4, 0, 0, 57]], ["line", [40, 24, 0, -4, 0]]]
        }
    }, !0)
}
;
